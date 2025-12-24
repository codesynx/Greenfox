import React, { useState, useEffect } from 'react';
import { Pressable, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { YStack, XStack, Text, Button, Input, Checkbox, Spacer } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'iconsax-react-native';
import { Check } from 'lucide-react-native';
import { PaymentIcon } from 'react-native-payment-card-icons';
import { useTranslation } from 'react-i18next';

export default function AddCardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const { onCardAdded } = (route.params as any) || {};

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [cardType, setCardType] = useState('generic-card');

  useEffect(() => {
    // Simple detection
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) {
        setCardType('visa');
    } else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
        setCardType('mastercard');
    } else if (/^3[47]/.test(number)) {
        setCardType('amex');
    } else if (/^6(?:011|5)/.test(number)) {
        setCardType('discover');
    } else {
        setCardType('generic-card');
    }
  }, [cardNumber]);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const matches = cleaned.match(/.{1,4}/g);
    return matches ? matches.join(' ') : cleaned;
  };

  const handleCardNumberChange = (text: string) => {
      setCardNumber(formatCardNumber(text));
  };

  const formatExpiry = (text: string) => {
      const cleaned = text.replace(/\D/g, '');
      if (cleaned.length >= 3) {
          return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      return cleaned;
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a" paddingBottom={insets.bottom}>
      <YStack paddingTop={insets.top} paddingHorizontal="$4" flex={1}>
        
        {/* Header */}
        <XStack alignItems="center" gap="$3" paddingVertical="$2" marginBottom="$6">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#ffffff" />
          </Pressable>
          <Text fontSize={20} fontWeight="700" color="#ffffff">{t('addCard.title')}</Text>
        </XStack>

        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <YStack gap="$6" flex={1}>
                    
                    {/* Card Holder */}
                    <YStack gap="$2">
                        <Text fontSize={14} color="rgba(255,255,255,0.5)">{t('addCard.cardName')}</Text>
                        <Input 
                            value={cardHolder}
                            onChangeText={setCardHolder}
                            placeholder="Abilmansur Omar"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            autoCapitalize="words"
                            borderWidth={0}
                            borderBottomWidth={1}
                            borderBottomColor="rgba(255,255,255,0.1)"
                            backgroundColor="transparent"
                            paddingLeft={0}
                            fontSize={18}
                            fontWeight="600"
                            color="#ffffff"
                            focusStyle={{ borderBottomColor: '#22c55e', borderWidth: 0, borderBottomWidth: 1 }}
                        />
                    </YStack>

                    {/* Card Number */}
                    <YStack gap="$2">
                        <Text fontSize={14} color="rgba(255,255,255,0.5)">{t('addCard.cardNumber')}</Text>
                        <XStack 
                            borderBottomWidth={1} 
                            borderBottomColor={cardNumber ? "#22c55e" : "rgba(255,255,255,0.1)"}
                            alignItems="center"
                        >
                            <Input 
                                value={cardNumber}
                                onChangeText={handleCardNumberChange}
                                placeholder="0000 0000 0000 0000"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                                maxLength={19}
                                flex={1}
                                borderWidth={0}
                                backgroundColor="transparent"
                                paddingLeft={0}
                                fontSize={18}
                                fontWeight="600"
                                color="#ffffff"
                                focusStyle={{ borderWidth: 0 }}
                            />
                            {cardNumber.length > 0 && (
                                <PaymentIcon type={cardType as any} variant="logo" width={40} height={25} />
                            )}
                        </XStack>
                    </YStack>

                    {/* Expiry & CVC */}
                    <XStack gap="$6">
                        <YStack gap="$2" flex={1}>
                            <Text fontSize={14} color="rgba(255,255,255,0.5)">{t('addCard.expiry')}</Text>
                            <Input 
                                value={expiry}
                                onChangeText={(t) => setExpiry(formatExpiry(t))}
                                placeholder="MM/YY"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                                maxLength={5}
                                borderWidth={0}
                                borderBottomWidth={1}
                                borderBottomColor="rgba(255,255,255,0.1)"
                                backgroundColor="transparent"
                                paddingLeft={0}
                                fontSize={18}
                                fontWeight="600"
                                color="#ffffff"
                                focusStyle={{ borderBottomColor: '#22c55e', borderWidth: 0, borderBottomWidth: 1 }}
                            />
                        </YStack>
                        <YStack gap="$2" flex={1}>
                            <Text fontSize={14} color="rgba(255,255,255,0.5)">{t('addCard.cvc')}</Text>
                            <Input 
                                value={cvc}
                                onChangeText={setCvc}
                                placeholder="123"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                                borderWidth={0}
                                borderBottomWidth={1}
                                borderBottomColor="rgba(255,255,255,0.1)"
                                backgroundColor="transparent"
                                paddingLeft={0}
                                fontSize={18}
                                fontWeight="600"
                                color="#ffffff"
                                focusStyle={{ borderBottomColor: '#22c55e', borderWidth: 0, borderBottomWidth: 1 }}
                            />
                        </YStack>
                    </XStack>

                    {/* Secure Save */}
                    <XStack alignItems="center" gap="$3" marginTop="$2">
                        <Checkbox 
                            size="$5"
                            checked={saveCard}
                            onCheckedChange={(checked) => setSaveCard(!!checked)}
                            borderColor="#22c55e"
                            backgroundColor={saveCard ? "#22c55e" : "transparent"}
                            borderRadius={10} 
                        >
                            <Checkbox.Indicator>
                                <Check size={16} color="#ffffff" strokeWidth={3} />
                            </Checkbox.Indicator>
                        </Checkbox>
                        <Pressable onPress={() => setSaveCard(!saveCard)}>
                            <Text fontSize={14} color="#ffffff">{t('addCard.saveCard')}</Text>
                        </Pressable>
                    </XStack>

                    <Spacer flex={1} />

                    {/* Submission Footer */}
                    <Button 
                        backgroundColor="#22c55e" 
                        borderRadius={999} 
                        height={56} 
                        marginBottom="$4"
                        onPress={() => {
                            // Handle adding card
                            const last4 = cardNumber.slice(-4);
                            const newCard = {
                                id: Date.now().toString(),
                                type: cardType,
                                label: `${cardType === 'visa' ? 'Visa' : cardType === 'mastercard' ? 'Mastercard' : 'Card'} **** ${last4}`,
                                last4
                            };
                            
                            if (onCardAdded) {
                                onCardAdded(newCard);
                            }
                            navigation.goBack();
                        }}
                        pressStyle={{ opacity: 0.8 }}
                    >
                        <Text color="#ffffff" fontWeight="700" fontSize={16}>{t('addCard.addBtn')}</Text>
                    </Button>
                </YStack>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

      </YStack>
    </YStack>
  );
}
