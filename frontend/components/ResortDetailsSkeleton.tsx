import React from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ 
  width: w, 
  height: h, 
  borderRadius = 4, 
  style 
}: { 
  width?: number | string; 
  height?: number | string; 
  borderRadius?: number;
  style?: any; 
}) => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 0.7 }}
    transition={{
      type: 'timing',
      duration: 800,
      loop: true,
      repeatReverse: true,
    }}
    style={[{
      width: w,
      height: h,
      backgroundColor: '#2C2C2C',
      borderRadius,
    }, style]}
  />
);

export const ResortDetailsSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Image Skeleton */}
        <SkeletonItem width={width} height={450} borderRadius={0} />

        {/* Content Section */}
        <YStack paddingHorizontal="$4" paddingTop="$5" gap="$4">
          
          {/* Title & Address */}
          <YStack gap="$2">
            <SkeletonItem width="80%" height={32} borderRadius={8} />
            <SkeletonItem width="50%" height={20} borderRadius={6} />
          </YStack>

          {/* Description */}
          <YStack gap="$2" marginTop="$4">
             <SkeletonItem width="40%" height={24} borderRadius={6} />
             <YStack gap="$2" marginTop="$2">
                <SkeletonItem width="100%" height={16} />
                <SkeletonItem width="100%" height={16} />
                <SkeletonItem width="90%" height={16} />
                <SkeletonItem width="60%" height={16} />
             </YStack>
          </YStack>

          {/* Amenities */}
          <YStack marginTop="$4">
            <SkeletonItem width="30%" height={24} borderRadius={6} style={{ marginBottom: 12 }} />
            <XStack gap="$4">
                {[1, 2, 3, 4].map((i) => (
                    <YStack key={i} alignItems="center" gap="$2">
                        <SkeletonItem width={64} height={64} borderRadius={32} />
                        <SkeletonItem width={40} height={12} />
                    </YStack>
                ))}
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Bottom Bar Skeleton */}
      <YStack 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0} 
        backgroundColor="#1a1a1a" 
        padding="$4" 
        paddingBottom={insets.bottom + 16}
        borderTopWidth={1}
        borderTopColor="rgba(255,255,255,0.1)"
      >
        <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$1">
                <SkeletonItem width={100} height={28} borderRadius={6} />
                <SkeletonItem width={60} height={14} borderRadius={4} />
            </YStack>
            <SkeletonItem width={140} height={56} borderRadius={28} />
        </XStack>
      </YStack>
    </YStack>
  );
};
