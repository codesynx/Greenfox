import { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions, StatusBar, Platform } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  Extrapolation,
} from 'react-native-reanimated';
import { YStack, XStack, Text } from 'tamagui';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'iconsax-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { enUS, ru, kk } from 'date-fns/locale';

import { PromoResponse } from '../services/promoService';
import { resortService } from '../services/resortService';
import { PropertyCard } from '../components/home/PropertyCard';
import { PropertyCardSkeleton } from '../components/home/PropertyCardSkeleton';
import { Property } from '../components/home/types';
import { useFavorites } from '../contexts/FavoritesContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMG_HEIGHT = 400;

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function PromoDetailsScreen() {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Params
  const { promo } = route.params as { promo: PromoResponse };
  const { isFavorite, toggleFavorite } = useFavorites();

  const [resort, setResort] = useState<Property | null>(null);
  const [isLoadingResort, setIsLoadingResort] = useState(true);

  // Shared Values for Animation
  const scrollY = useSharedValue(0);

  // Date locale map
  const dateLocales: Record<string, any> = {
    en: enUS,
    ru: ru,
    kk: kk
  };
  const currentLocale = dateLocales[i18n.language] || enUS;

  useEffect(() => {
    loadResortDetails();
  }, [promo.resortId]);

  const loadResortDetails = async () => {
    try {
      setIsLoadingResort(true);
      const response = await resortService.getResortById(promo.resortId);
      const property: Property = {
        id: response.id,
        name: response.name,
        location: response.city,
        price: response.promo && response.promoPrice ? response.promoPrice : response.basePrice,
        rating: response.rating,
        image: (response.photos && response.photos.length > 0) ? response.photos[0].url : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        type: 'resort',
      };
      setResort(property);
    } catch (err) {
      console.error('Failed to load resort details:', err);
    } finally {
      setIsLoadingResort(false);
    }
  };

  const bannerImage = promo.bannerImageUrl || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800';

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Parallax Header Style
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [-IMG_HEIGHT, 0, IMG_HEIGHT],
        [IMG_HEIGHT * 2, IMG_HEIGHT, IMG_HEIGHT * 0.5],
        Extrapolation.CLAMP
      ),
      top: 0,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Close Button - High Z-Index */}
      <View style={[styles.closeButtonContainer, { top: insets.top + 10 }]}>
        <Pressable 
            onPress={() => navigation.goBack()}
            hitSlop={15}
            style={({pressed}) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <View style={styles.closeButtonCircle}>
             <Ionicons name="close" size={24} color="#000" />
          </View>
        </Pressable>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Parallax Image Header */}
        <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
          <AnimatedImage
            source={{ uri: bannerImage }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={['transparent', 'rgba(10,10,10,0.8)', '#0a0a0a']}
            locations={[0.5, 0.8, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Content */}
        <View style={styles.contentContainer}>
             {/* Discount Badge */}
            <YStack
              backgroundColor="#22c55e"
              alignSelf="flex-start"
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius={100}
              marginBottom="$4"
            >
              <Text fontSize={14} fontWeight="700" color="white">
                {promo.discountPercent}% {t('promo.discount')}
              </Text>
            </YStack>

            <Text fontSize={32} fontWeight="800" color="#ffffff" lineHeight={40} marginBottom="$4">
                {promo.title || promo.resortName}
            </Text>

            {/* Date Info */}
            <XStack alignItems="center" gap="$3" marginBottom="$6">
                <View style={styles.iconContainer}>
                    <Ionicons name="calendar" size={20} color="#22c55e" />
                </View>
                <YStack>
                    <Text fontSize={12} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" letterSpacing={1}>
                        {t('promo.validUntil')}
                    </Text>
                    <Text fontSize={16} color="#ffffff" fontWeight="600" marginTop={2}>
                        {format(parseISO(promo.startDate), 'd MMM', { locale: currentLocale })} - {format(parseISO(promo.endDate), 'd MMM yyyy', { locale: currentLocale })}
                    </Text>
                </YStack>
            </XStack>

            <View style={styles.divider} />

            {/* Description */}
            <YStack marginTop="$6" gap="$3">
                <Text fontSize={20} fontWeight="700" color="#ffffff">
                    {t('details.about')}
                </Text>
                <Text fontSize={16} color="rgba(255, 255, 255, 0.8)" lineHeight={28} letterSpacing={0.3}>
                    {promo.description || t('promo.defaultDescription', { resortName: promo.resortName })}
                </Text>
            </YStack>

            <View style={[styles.divider, { marginVertical: 32 }]} />

            {/* Resort Card */}
            <YStack gap="$4">
                <Text fontSize={20} fontWeight="700" color="#ffffff">
                    {t('promo.aboutResort')}
                </Text>
                
                {isLoadingResort ? (
                    <PropertyCardSkeleton />
                ) : resort ? (
                    <PropertyCard
                        property={resort}
                        isFavorite={isFavorite(resort.id)}
                        onPress={() => (navigation as any).push('Details', { propertyId: resort.id })}
                        onFavoritePress={() => toggleFavorite(resort.id)}
                    />
                ) : (
                    <Text color="rgba(255,255,255,0.5)">
                        {t('promo.resortUnavailable')}
                    </Text>
                )}
            </YStack>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  imageContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButtonContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 100,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contentContainer: {
    marginTop: IMG_HEIGHT - 60,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
});
