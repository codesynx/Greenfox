import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Pressable, Dimensions, StatusBar, BackHandler } from 'react-native';
import Reanimated, {
  useSharedValue,
  withTiming,
  interpolate,
  useAnimatedStyle,
  runOnJS,
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
import { MotiView } from 'moti';

import { PromoResponse } from '../services/promoService';
import { resortService } from '../services/resortService';
import { PropertyCard } from '../components/home/PropertyCard';
import { PropertyCardSkeleton } from '../components/home/PropertyCardSkeleton';
import { Property } from '../components/home/types';
import { useFavorites } from '../contexts/FavoritesContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMG_HEIGHT = 350;

export default function PromoDetailsScreen() {
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Params
  const { promo, mediaSpecs } = route.params as { promo: PromoResponse, mediaSpecs?: any };
  const { isFavorite, toggleFavorite } = useFavorites();

  const [resort, setResort] = useState<Property | null>(null);
  const [isLoadingResort, setIsLoadingResort] = useState(true);

  // Shared Values for Animation
  const animated = useSharedValue(0);
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
    
    // Start entry animation
    if (mediaSpecs) {
        animated.value = withTiming(1, { duration: 300 });
    } else {
        animated.value = 1;
    }

    // Handle back button
    const backAction = () => {
      handleGoBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
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

  const handleGoBack = () => {
    if (mediaSpecs) {
      animated.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(navigation.goBack)();
      });
    } else {
      navigation.goBack();
    }
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Animated Styles
  const animatedImageStyle = useAnimatedStyle(() => {
    if (!mediaSpecs) {
        // Fallback if no specs provided
        return {
            width: '100%',
            height: IMG_HEIGHT,
            position: 'absolute',
            top: 0,
            transform: [{ translateY: -scrollY.value }]
        };
    }

    return {
      position: 'absolute',
      top: interpolate(animated.value, [0, 1], [mediaSpecs.pageY, 0]),
      left: interpolate(animated.value, [0, 1], [mediaSpecs.pageX, 0]),
      width: interpolate(animated.value, [0, 1], [mediaSpecs.width, SCREEN_WIDTH]),
      height: interpolate(animated.value, [0, 1], [mediaSpecs.height, IMG_HEIGHT]),
      borderRadius: interpolate(animated.value, [0, 1], [mediaSpecs.borderRadius, 0]),
      transform: [{ translateY: -scrollY.value * animated.value }], // Only scroll when expanded? Or always?
      // When animating (value < 1), scrollY is likely 0. 
      // When value is 1, we want normal parallax or scroll behavior.
      zIndex: 1,
      overflow: 'hidden',
    };
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: animated.value,
    backgroundColor: '#0a0a0a',
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: animated.value,
    transform: [{ translateY: interpolate(animated.value, [0, 1], [50, 0]) }],
  }));

  const headerOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
        scrollY.value,
        [0, IMG_HEIGHT - 100],
        [0, 1],
        Extrapolation.CLAMP
    );
    return {
        opacity: opacity * animated.value, // Combine with enter animation
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      
      {/* Background that fades in */}
      <Reanimated.View style={backgroundStyle}>
        {/* Background Blur Effect */}
        <Reanimated.Image
            source={{ uri: bannerImage }}
            style={[StyleSheet.absoluteFill, { opacity: 0.15 }]}
            blurRadius={40}
        />
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,10,10,0.7)' }} />
      </Reanimated.View>

      {/* Shared Element Image */}
      <Reanimated.View style={animatedImageStyle}>
        <Reanimated.Image
            source={{ uri: bannerImage }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
        />
        <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', '#0a0a0a']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
        />
        
        {/* Discount Badge on Image */}
         <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 300 }}
            style={{ position: 'absolute', bottom: 40, left: 20 }}
          >
             <YStack
              backgroundColor="#22c55e"
              alignSelf="flex-start"
              paddingHorizontal="$4"
              paddingVertical="$2"
              borderRadius={12}
              marginBottom="$2"
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
            >
              <Text fontSize={16} fontWeight="800" color="white">
                {promo.discountPercent}% {t('promo.discount')}
              </Text>
            </YStack>
          </MotiView>
      </Reanimated.View>

      {/* Animated Header Background */}
      <Reanimated.View 
        style={[
          styles.headerBackground, 
          { 
            height: insets.top + 60,
            paddingTop: insets.top 
          },
          headerOpacityStyle
        ]} 
      >
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFill}
            />
        </View>
        <Text 
            color="white" 
            fontSize={16} 
            fontWeight="700" 
            textAlign="center" 
            numberOfLines={1} 
            paddingHorizontal={60}
            paddingTop={10}
        >
            {promo.title || promo.resortName}
        </Text>
      </Reanimated.View>

      {/* Header Back Button - Always visible but might fade in? */}
      <Reanimated.View 
        style={{ 
            position: 'absolute', 
            top: insets.top + 10, 
            left: 20, 
            zIndex: 20,
            opacity: animated.value // Fade in with the rest
        }}
      >
        <Pressable onPress={handleGoBack}>
          <ArrowLeft size={28} color="#ffffff" />
        </Pressable>
      </Reanimated.View>

      <Reanimated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: IMG_HEIGHT }}
      >
        {/* Content */}
        <Reanimated.View style={contentStyle}>
            <YStack padding="$5" gap="$5" marginTop={-20}>
            
            <YStack gap="$2">
                <Text fontSize={32} fontWeight="800" color="#ffffff" lineHeight={38}>
                {promo.title || promo.resortName}
                </Text>
                
                <XStack alignItems="center" gap="$2" marginTop="$2">
                <YStack backgroundColor="rgba(255,255,255,0.1)" padding="$2" borderRadius={8}>
                    <Ionicons name="calendar-outline" size={20} color="#22c55e" />
                </YStack>
                <YStack>
                    <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        {t('promo.validUntil')}
                    </Text>
                    <Text fontSize={14} color="rgba(255, 255, 255, 0.9)" fontWeight="600">
                        {format(parseISO(promo.startDate), 'd MMM', { locale: currentLocale })} - {format(parseISO(promo.endDate), 'd MMM yyyy', { locale: currentLocale })}
                    </Text>
                </YStack>
                </XStack>
            </YStack>

            {/* Description Card */}
            <YStack 
                backgroundColor="rgba(255,255,255,0.05)" 
                padding="$4" 
                borderRadius={20} 
                borderWidth={1} 
                borderColor="rgba(255,255,255,0.05)"
            >
                <Text fontSize={16} color="rgba(255, 255, 255, 0.8)" lineHeight={26}>
                {promo.description || `Enjoy a special discount at ${promo.resortName}. Book now to secure your stay at this amazing price!`}
                </Text>
            </YStack>

            {/* Resort Section */}
            <YStack gap="$3" marginTop="$4" marginBottom="$8">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={22} fontWeight="700" color="#ffffff">
                        {t('promo.aboutResort')}
                    </Text>
                    <Ionicons name="arrow-forward-circle-outline" size={28} color="rgba(255,255,255,0.3)" />
                </XStack>
                
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
                <Text color="rgba(255,255,255,0.5)">Resort details unavailable</Text>
                )}
            </YStack>

            </YStack>
        </Reanimated.View>
      </Reanimated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  }
});
