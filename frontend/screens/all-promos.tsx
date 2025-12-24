import { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Image, Pressable, ActivityIndicator, View } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { promoService, PromoResponse } from '../services/promoService';

const PromoItem = ({ promo, navigation, t }: { promo: PromoResponse; navigation: any; t: any }) => {
  const ref = useRef<View>(null);

  const handlePress = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      navigation.navigate('PromoDetails', {
        promo,
        mediaSpecs: {
          width,
          height,
          pageX,
          pageY,
          borderRadius: 16,
        },
      });
    });
  };

  return (
    <Pressable ref={ref} onPress={handlePress}>
      <XStack borderRadius={16} overflow="hidden" style={styles.card}>
        <Image
          source={{
            uri:
              promo.bannerImageUrl ||
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          }}
          style={styles.cardImage}
        />
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
          <YStack flex={1} padding="$3" justifyContent="space-between">
            <YStack>
              <XStack justifyContent="space-between" alignItems="flex-start">
                <YStack
                  backgroundColor="#22c55e"
                  paddingHorizontal="$2"
                  paddingVertical={2}
                  borderRadius={4}
                  alignSelf="flex-start"
                  marginBottom="$1"
                >
                  <Text fontSize={10} fontWeight="700" color="white">
                    {promo.discountPercent}% {t('home.off')}
                  </Text>
                </YStack>
              </XStack>

              <Text fontSize={16} fontWeight="700" color="#ffffff" numberOfLines={2}>
                {promo.title || promo.resortName}
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.7)" marginTop="$1" numberOfLines={1}>
                {promo.resortName}
              </Text>
            </YStack>

            <XStack alignItems="center" gap="$1" marginTop="$2">
              <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.5)" />
              <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                Limited time offer
              </Text>
            </XStack>
          </YStack>
        </BlurView>
      </XStack>
    </Pressable>
  );
};

export default function AllPromosScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [promos, setPromos] = useState<PromoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      setIsLoading(true);
      const data = await promoService.getActivePromos();
      setPromos(data);
    } catch (err) {
      console.error('Failed to load promos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <YStack paddingTop={insets.top + 10} paddingHorizontal="$4" paddingBottom="$4" gap="$4">
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={28} color="#ffffff" />
        </Pressable>
        <Text fontSize={28} fontWeight="700" color="#ffffff">
          {t('home.specialOffers') || 'All Promos'}
        </Text>
      </YStack>

      {isLoading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color="#22c55e" />
        </YStack>
      ) : promos.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$6">
          <Ionicons name="pricetag-outline" size={48} color="rgba(255,255,255,0.3)" />
          <Text fontSize={18} fontWeight="600" color="#ffffff" textAlign="center" marginTop="$4">
            No active promotions
          </Text>
        </YStack>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <YStack paddingHorizontal="$4" gap="$4">
            {promos.map((promo) => (
              <PromoItem 
                key={promo.id} 
                promo={promo} 
                navigation={navigation}
                t={t}
              />
            ))}
          </YStack>
        </ScrollView>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardImage: {
    width: 120,
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  blurContainer: {
    flex: 1,
  },
});
