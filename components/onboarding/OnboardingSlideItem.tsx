import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { YStack, Text } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { OnboardingSlide } from './types';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideItemProps {
  item: OnboardingSlide;
}

export const OnboardingSlideItem = ({ item }: OnboardingSlideItemProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay} />
      <YStack style={styles.content} gap="$4">
        <Text fontSize={36} fontWeight="700" color="white" textAlign="center" numberOfLines={3} ellipsizeMode="tail">
          {t(item.titleKey)}
        </Text>
        <Text fontSize={18} color="white" opacity={0.9} textAlign="center" paddingHorizontal="$6" numberOfLines={4} ellipsizeMode="tail">
          {t(item.subtitleKey)}
        </Text>
      </YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    height,
  },
  image: {
    width,
    height,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    position: 'absolute',
    bottom: 200,
    width: '100%',
    paddingHorizontal: 24,
  },
});
