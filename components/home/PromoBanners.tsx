import { useState, useEffect, useRef } from 'react';
import { FlatList, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { PromoBanner } from './types';

const { width } = Dimensions.get('window');

interface PromoBannersProps {
  banners: PromoBanner[];
}

export const PromoBanners = ({ banners }: PromoBannersProps) => {
  const { t } = useTranslation();
  const bannerRef = useRef<FlatList>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const renderPromoBanner = ({ item }: { item: PromoBanner }) => (
    <Pressable style={styles.bannerContainer}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.9)']}
        style={styles.bannerGradient}
      />
      <YStack position="absolute" bottom={20} left={20} right={20}>
        <XStack justifyContent="space-between" alignItems="flex-end">
          <YStack flex={1}>
            <YStack
              backgroundColor="#22c55e"
              alignSelf="flex-start"
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius={999}
              marginBottom="$2"
            >
              <Text fontSize={12} fontWeight="700" color="white">
                {item.discount}
              </Text>
            </YStack>
            <Text fontSize={24} fontWeight="700" color="#ffffff" marginBottom="$1">
              {item.title}
            </Text>
            <Text fontSize={15} color="rgba(255, 255, 255, 0.9)">
              {item.subtitle}
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </Pressable>
  );

  return (
    <YStack>
      <XStack paddingHorizontal="$4" marginBottom="$3" justifyContent="space-between" alignItems="center">
        <Text fontSize={20} fontWeight="700" color="#ffffff">{t('home.specialOffers')}</Text>
        <Text fontSize={14} color="#22c55e" fontWeight="600">{t('home.seeAll')}</Text>
      </XStack>
      <FlatList
        ref={bannerRef}
        data={banners}
        renderItem={renderPromoBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
          setCurrentBannerIndex(index);
        }}
      />
    </YStack>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: width - 48,
    height: 200,
    marginLeft: 16,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1a1a1a',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
