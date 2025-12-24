import { View, StyleSheet, Pressable } from 'react-native';
import { XStack, Text, Button } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface OnboardingFooterProps {
  currentIndex: number;
  totalSlides: number;
  onSkip: () => void;
  onNext: () => void;
}

export const OnboardingFooter = ({ currentIndex, totalSlides, onSkip, onNext }: OnboardingFooterProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, { bottom: insets.bottom + 32 }]}>
      <Pressable onPress={onSkip}>
        <Text fontSize={16} color="white" fontWeight="600">
          {t('onboarding.skip')}
        </Text>
      </Pressable>

      <XStack gap="$2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? '#22c55e' : 'rgba(255,255,255,0.3)',
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </XStack>

      <Button
        onPress={onNext}
        backgroundColor="#22c55e"
        color="white"
        paddingHorizontal="$6"
        height={56}
        borderRadius={999}
        pressStyle={{ backgroundColor: '#16a34a' }}
      >
        {currentIndex === totalSlides - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
