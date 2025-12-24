import { useState, useRef, useEffect } from 'react';
import { StatusBar, TextInput, StyleSheet, Animated, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { YStack, XStack, Text, Button, Spinner } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function OTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string>('');
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as any;
  const phoneNumber = routeParams?.phoneNumber || '';
  const expiresInSeconds = routeParams?.expiresInSeconds || 60;
  const retryAfterSeconds = routeParams?.retryAfterSeconds || 60;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { login } = useAuth();
  
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Initialize timer with value from API response
    if (expiresInSeconds) {
      setTimer(expiresInSeconds);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const showToastNotification = () => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  };

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.charAt(text.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError(t('otp.invalidCode'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp(phoneNumber, code);

      // Save tokens and update auth state
      await login(response);

      // Show welcome message for new users
      if (response.newUser) {
        Alert.alert(
          t('otp.welcome'),
          `Welcome ${response.name || ''}! Your account has been created.`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' as never }],
                });
              },
            },
          ]
        );
      } else {
        // Existing user, reset navigation stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || t('otp.errorVerifying');
      setError(errorMessage);
      Alert.alert(t('otp.errorTitle'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    setError('');

    try {
      const response = await authService.resendOtp(phoneNumber);

      // Reset OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      // Set new timer from response
      setTimer(response.retryAfterSeconds || 60);

      // Show success toast
      showToastNotification();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend code';
      setError(errorMessage);
      Alert.alert(t('otp.errorTitle'), errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <>
      <StatusBar barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack flex={1} backgroundColor="#0a0a0a" paddingHorizontal="$6" paddingTop={insets.top} paddingBottom={insets.bottom} justifyContent="center">
          <YStack gap="$8" marginBottom="$10">
            <YStack gap="$3">
              <Text fontSize={32} fontWeight="700" color="#ffffff">
                {t('otp.title')}
              </Text>
              <Text fontSize={16} color="rgba(255, 255, 255, 0.7)" lineHeight={24} numberOfLines={3} ellipsizeMode="tail">
                {t('otp.subtitle')}{'\n'}
                <Text fontWeight="600" color="#ffffff">
                  {phoneNumber}
                </Text>
              </Text>
            </YStack>

            <XStack gap="$3" justifyContent="center">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </XStack>

            <YStack gap="$3" alignItems="center">
              <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">
                {timer > 0 ? t('otp.resendWait', { time: formatTime(timer) }) : t('otp.didntReceive')}
              </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={timer > 0 || isResending}
                activeOpacity={0.7}
                style={{ padding: 4 }}
              >
                <XStack gap="$2" alignItems="center">
                  {isResending && <Spinner size="small" color="#22c55e" />}
                  <Text
                    color={timer > 0 || isResending ? "rgba(255,255,255,0.3)" : "#22c55e"}
                    fontWeight="600"
                    fontSize={15}
                  >
                    {t('otp.resend')}
                  </Text>
                </XStack>
              </TouchableOpacity>
            </YStack>

            {error && (
              <Text fontSize={14} color="#ef4444" textAlign="center">
                {error}
              </Text>
            )}
          </YStack>

          <Button
            backgroundColor={isComplete && !isLoading ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}
            color={isComplete && !isLoading ? 'white' : 'rgba(255, 255, 255, 0.5)'}
            borderRadius={999}
            height={56}
            fontSize={16}
            fontWeight="600"
            pressStyle={{
              backgroundColor: isComplete && !isLoading ? '#16a34a' : 'rgba(255, 255, 255, 0.1)',
            }}
            disabled={!isComplete || isLoading}
            onPress={handleVerify}
            icon={isLoading ? <Spinner color="white" /> : undefined}
          >
            {isLoading ? t('otp.verifying') : t('otp.verify')}
          </Button>
        </YStack>
      </TouchableWithoutFeedback>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity, top: insets.top + 20 }]}>
          <BlurView intensity={40} tint="dark" style={styles.toastBlur}>
            <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingVertical="$3">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text color="white" fontWeight="600">{t('otp.codeResent')}</Text>
            </XStack>
          </BlurView>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  otpInputFilled: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 200,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastBlur: {
    borderRadius: 999,
  }
});
