import { useState, useRef, useEffect } from 'react';
import { StatusBar, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [showToast, setShowToast] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const phoneNumber = (route.params as any)?.phoneNumber || '';
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef<(TextInput | null)[]>([]);

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
    if (code.length === 6) {
      try {
        await AsyncStorage.setItem('userPhoneNumber', phoneNumber);
        navigation.navigate('MainTabs' as never);
      } catch (error) {
        console.error('Error saving phone number:', error);
        // Still navigate even if save fails, or handle error appropriately
        navigation.navigate('MainTabs' as never);
      }
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setTimer(60);
    showToastNotification();
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <>
      <StatusBar barStyle="light-content" />
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
              disabled={timer > 0}
              activeOpacity={0.7}
              style={{ padding: 4 }}
            >
              <Text
                color={timer > 0 ? "rgba(255,255,255,0.3)" : "#22c55e"}
                fontWeight="600"
                fontSize={15}
              >
                {t('otp.resend')}
              </Text>
            </TouchableOpacity>
          </YStack>
        </YStack>

        <Button
          backgroundColor={isComplete ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}
          color={isComplete ? 'white' : 'rgba(255, 255, 255, 0.5)'}
          borderRadius={999}
          height={56}
          fontSize={16}
          fontWeight="600"
          pressStyle={{
            backgroundColor: isComplete ? '#16a34a' : 'rgba(255, 255, 255, 0.1)',
          }}
          disabled={!isComplete}
          onPress={handleVerify}
        >
          {t('otp.verify')}
        </Button>
      </YStack>

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
