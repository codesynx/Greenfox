import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { YStack, Text, Button } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function BookingSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(300, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <YStack flex={1} backgroundColor="#0a0a0a" justifyContent="center" alignItems="center" padding="$6">
      <Animated.View style={[styles.circle, animatedStyle]}>
        <Check size={64} color="#ffffff" strokeWidth={3} />
      </Animated.View>
      
      <YStack gap="$2" marginTop="$6" alignItems="center">
        <Text color="#ffffff" fontSize={24} fontWeight="700" textAlign="center">
          {t('bookingSuccess.title')}
        </Text>
        <Text color="rgba(255,255,255,0.6)" fontSize={16} textAlign="center">
          {t('bookingSuccess.message')}
        </Text>
      </YStack>

      <Button
        backgroundColor="#22c55e"
        borderRadius={999}
        height={56}
        width="100%"
        marginTop="$10"
        onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' as any }],
        })}
        pressStyle={{ opacity: 0.8 }}
      >
        <Text color="#ffffff" fontWeight="700" fontSize={16}>{t('bookingSuccess.homeBtn')}</Text>
      </Button>
    </YStack>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
