import React, { useState } from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'iconsax-react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

export default function GuestInfo() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const params = route.params as any || {};
  const { property, startDate, endDate, adults, children } = params;
  
  // Calculate nights and price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
  const totalPrice = (property?.price || 0) * nights;

  const [fullName, setFullName] = useState('');
  const [idType, setIdType] = useState<'iin' | 'passport'>('iin');
  const [idNumber, setIdNumber] = useState('');
  const [errors, setErrors] = useState<{name?: string, id?: string}>({});

  const validate = () => {
    const newErrors: {name?: string, id?: string} = {};
    if (!fullName.trim()) newErrors.name = t('guestInfo.errors.nameRequired');
    
    if (idType === 'iin') {
      if (idNumber.length !== 12 || !/^\d+$/.test(idNumber)) {
        newErrors.id = t('guestInfo.errors.iinLength');
      }
    } else {
        if (!idNumber.trim()) {
            newErrors.id = t('guestInfo.errors.passportRequired');
        }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigation.navigate('Payment' as any, {
        property,
        startDate,
        endDate,
        guestCount: (adults || 0) + (children || 0),
        adults,
        children,
        guestDetails: {
            fullName,
            idType,
            idNumber
        }
      });
    }
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
        <YStack paddingTop={insets.top} flex={1}>
            {/* Header */}
            <XStack paddingHorizontal="$4" paddingVertical="$4" alignItems="center" gap="$4">
                <Pressable onPress={() => navigation.goBack()}>
                    <ArrowLeft size={28} color="#ffffff" />
                </Pressable>
                <Text fontSize={20} fontWeight="700" color="#ffffff">{t('guestInfo.title')}</Text>
            </XStack>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <YStack paddingHorizontal="$4" gap="$6" marginTop="$4">
                    
                    {/* Full Name */}
                    <YStack gap="$2">
                        <Text fontSize={14} color="rgba(255,255,255,0.6)">{t('guestInfo.fullName')}</Text>
                        <Input
                            backgroundColor="rgba(255,255,255,0.05)"
                            borderColor={errors.name ? '#ef4444' : "rgba(255,255,255,0.1)"}
                            borderWidth={1}
                            borderRadius={12}
                            height={50}
                            color="white"
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text);
                                if (errors.name) setErrors({...errors, name: undefined});
                            }}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                         {errors.name && <Text color="#ef4444" fontSize={12}>{errors.name}</Text>}
                    </YStack>

                    {/* ID Type Selector */}
                    <YStack gap="$2">
                        <Text fontSize={14} color="rgba(255,255,255,0.6)">{t('guestInfo.idType')}</Text>
                        <XStack 
                            backgroundColor="rgba(255,255,255,0.05)" 
                            padding="$1" 
                            borderRadius={12}
                        >
                            <Pressable 
                                onPress={() => {
                                    setIdType('iin');
                                    setIdNumber('');
                                    setErrors({...errors, id: undefined});
                                }} 
                                style={{ flex: 1 }}
                            >
                                <YStack 
                                    backgroundColor={idType === 'iin' ? "rgba(255,255,255,0.1)" : "transparent"} 
                                    paddingVertical="$2" 
                                    borderRadius={10} 
                                    alignItems="center"
                                >
                                    <Text fontWeight={idType === 'iin' ? "600" : "400"} color="white">{t('guestInfo.iin')}</Text>
                                </YStack>
                            </Pressable>
                            <Pressable 
                                onPress={() => {
                                    setIdType('passport');
                                    setIdNumber('');
                                    setErrors({...errors, id: undefined});
                                }} 
                                style={{ flex: 1 }}
                            >
                                <YStack 
                                    backgroundColor={idType === 'passport' ? "rgba(255,255,255,0.1)" : "transparent"} 
                                    paddingVertical="$2" 
                                    borderRadius={10} 
                                    alignItems="center"
                                >
                                    <Text fontWeight={idType === 'passport' ? "600" : "400"} color="white">{t('guestInfo.passport')}</Text>
                                </YStack>
                            </Pressable>
                        </XStack>
                    </YStack>

                    {/* ID Number Input */}
                    <YStack gap="$2">
                        <Text fontSize={14} color="rgba(255,255,255,0.6)">
                            {idType === 'iin' ? t('guestInfo.iin') : t('guestInfo.passport')}
                        </Text>
                        <Input
                            backgroundColor="rgba(255,255,255,0.05)"
                            borderColor={errors.id ? '#ef4444' : "rgba(255,255,255,0.1)"}
                            borderWidth={1}
                            borderRadius={12}
                            height={50}
                            color="white"
                            value={idNumber}
                            onChangeText={(text) => {
                                if (idType === 'iin') {
                                    const numeric = text.replace(/[^0-9]/g, '');
                                    if (numeric.length <= 12) setIdNumber(numeric);
                                } else {
                                    setIdNumber(text);
                                }
                                if (errors.id) setErrors({...errors, id: undefined});
                            }}
                            keyboardType={idType === 'iin' ? 'number-pad' : 'default'}
                            placeholder={idType === 'iin' ? t('guestInfo.iinPlaceholder') : t('guestInfo.passportPlaceholder')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                        {errors.id && <Text color="#ef4444" fontSize={12}>{errors.id}</Text>}
                    </YStack>

                </YStack>
            </ScrollView>

            {/* Footer */}
            <BlurView intensity={80} tint="dark" style={styles.footer}>
                <YStack padding="$4" paddingBottom={insets.bottom + 16} gap="$4">
                    <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('guestInfo.totalPrice')}</Text>
                        <Text fontSize={20} fontWeight="700" color="#22c55e">
                            ₸{totalPrice.toLocaleString()}
                        </Text>
                    </XStack>

                    <Button
                        backgroundColor="#22c55e"
                        color="white"
                        height={56}
                        borderRadius={999}
                        fontSize={16}
                        fontWeight="600"
                        pressStyle={{ backgroundColor: '#16a34a' }}
                        onPress={handleNext}
                    >
                        {t('guestInfo.payBook')}
                    </Button>
                </YStack>
            </BlurView>
        </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});
