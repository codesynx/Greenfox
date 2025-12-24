import { useState } from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { YStack, Text, Button, Input, Spinner } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { authService, validatePhoneNumber } from '../services/authService';

export default function PhoneNumberScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const formatPhoneNumber = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      setPhoneNumber('');
      return;
    }

    if (cleaned.length > 11) {
      cleaned = cleaned.slice(0, 11);
    }
    
    if (cleaned.startsWith('8')) {
      cleaned = '7' + cleaned.slice(1);
    }
    
    if (!cleaned.startsWith('7')) {
      cleaned = '7' + cleaned;
    }

    let formatted = '+7';
    if (cleaned.length > 1) {
      formatted += ' (' + cleaned.slice(1, 4);
    }
    if (cleaned.length >= 5) {
      formatted += ') ' + cleaned.slice(4, 7);
    }
    if (cleaned.length >= 8) {
      formatted += '-' + cleaned.slice(7, 9);
    }
    if (cleaned.length >= 10) {
      formatted += '-' + cleaned.slice(9, 11);
    }
    
    setPhoneNumber(formatted);
  };

  const handleContinue = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      setError(t('phoneNumber.invalidFormat'));
      return;
    }

    // Convert to international format for API
    const internationalFormat = '+' + cleaned;

    // Validate against API pattern
    if (!validatePhoneNumber(internationalFormat)) {
      setError(t('phoneNumber.invalidFormat'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.sendOtp(internationalFormat);

      // Navigate to OTP screen with phone number and expiry info
      (navigation.navigate as any)('OTP', {
        phoneNumber: internationalFormat,
        expiresInSeconds: response.expiresInSeconds,
        retryAfterSeconds: response.retryAfterSeconds,
      });
    } catch (err: any) {
      const errorMessage = err.message || t('phoneNumber.errorSendingOtp');
      setError(errorMessage);
      Alert.alert(t('phoneNumber.errorTitle'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = phoneNumber.replace(/\D/g, '').length === 11;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack flex={1} backgroundColor="#0a0a0a" paddingHorizontal="$6" paddingTop={insets.top} paddingBottom={insets.bottom} justifyContent="center">
          <StatusBar barStyle="light-content" />
          <YStack gap="$6" marginBottom="$10">
            <YStack gap="$3">
            <Text fontSize={32} fontWeight="700" color="#ffffff">
              {t('phoneNumber.title')}
            </Text>
            <Text fontSize={16} color="rgba(255, 255, 255, 0.7)" lineHeight={24}>
              {t('phoneNumber.subtitle')}
            </Text>
          </YStack>

          <YStack gap="$4">
            <YStack gap="$2">
              <Text fontSize={14} fontWeight="600" color="rgba(255, 255, 255, 0.9)">
                {t('phoneNumber.label')}
              </Text>
              <Input
                size="$5"
                value={phoneNumber}
                onChangeText={formatPhoneNumber}
                placeholder="+7 (___) ___-__-__"
                keyboardType="phone-pad"
                maxLength={18}
                backgroundColor="rgba(255, 255, 255, 0.1)"
                borderColor="rgba(255, 255, 255, 0.2)"
                borderWidth={2}
                borderRadius={999}
                fontSize={16}
                paddingHorizontal="$4"
                paddingVertical="$4"
                color="#ffffff"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                focusStyle={{
                  borderColor: '#22c55e',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                }}
              />
            </YStack>

            <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
              {t('phoneNumber.terms')}
            </Text>

            {error && (
              <Text fontSize={14} color="#ef4444" textAlign="center">
                {error}
              </Text>
            )}
            </YStack>
          </YStack>

          <Button
            backgroundColor={isValid && !isLoading ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}
            color={isValid && !isLoading ? 'white' : 'rgba(255, 255, 255, 0.5)'}
            borderRadius={999}
            height={56}
            fontSize={16}
            fontWeight="600"
            pressStyle={{
              backgroundColor: isValid && !isLoading ? '#16a34a' : 'rgba(255, 255, 255, 0.1)',
            }}
            disabled={!isValid || isLoading}
            onPress={handleContinue}
            icon={isLoading ? <Spinner color="white" /> : undefined}
          >
            {isLoading ? t('phoneNumber.sending') : t('phoneNumber.continue')}
          </Button>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
