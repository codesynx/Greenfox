import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { YStack, XStack } from 'tamagui';

export function PropertyCardSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <YStack
      borderRadius={20}
      overflow="hidden"
      backgroundColor="rgba(255, 255, 255, 0.05)"
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      {/* Image Skeleton */}
      <Animated.View style={[styles.imageSkeleton, { opacity }]} />

      {/* Content Skeleton */}
      <YStack padding="$4" gap="$3">
        {/* Title */}
        <Animated.View style={[styles.titleSkeleton, { opacity }]} />

        {/* Location & Rating Row */}
        <XStack justifyContent="space-between" alignItems="center">
          <Animated.View style={[styles.locationSkeleton, { opacity }]} />
          <Animated.View style={[styles.ratingSkeleton, { opacity }]} />
        </XStack>

        {/* Price */}
        <Animated.View style={[styles.priceSkeleton, { opacity }]} />
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  imageSkeleton: {
    width: '100%',
    height: 240,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleSkeleton: {
    width: '70%',
    height: 20,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationSkeleton: {
    width: 100,
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ratingSkeleton: {
    width: 50,
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceSkeleton: {
    width: 120,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
