import { useState, useRef, useEffect } from 'react';
import { ScrollView as RNScrollView, Image, StyleSheet, Pressable, Dimensions, View, Animated as RNAnimated } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import {
  ArrowLeft,
  More,
  Location,
  Wifi,
  Car,
  Coffee,
  Sun1,
  Weight,
  ArrowRight,
  Wind,
  Monitor,
  Lock,
  Heart,
  Drop,
  BrifecaseTick,
  Play,
  Game,
  Glass,
  ShoppingCart,
  Home2,
  Cup,
  Health,
  Activity,
  Hospital,
  Sun,
  Home,
  Building,
  Map,
  Clock,
  Profile2User,
  Airplane,
  Security,
  CloseCircle,
} from 'iconsax-react-native';
import { MotiView } from 'moti';
import { resortService, ResortDetails } from '../services/resortService';
import { useFavorites } from '../contexts/FavoritesContext';
import { AMENITIES_MAP } from '@shared/amenities.config';
import { ImageViewerModal } from '../components/ImageViewerModal';
import { ResortDetailsSkeleton } from '../components/ResortDetailsSkeleton';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 450;

// Icon mapping for iconsax-react-native
const ICON_COMPONENTS: Record<string, any> = {
  Wifi,
  Car,
  Coffee,
  Sun1,
  Weight,
  Wind,
  Monitor,
  Lock,
  Heart,
  Drop,
  BrifecaseTick,
  Play,
  Game,
  Glass,
  ShoppingCart,
  Home2,
  Cup,
  Health,
  Activity,
  Hospital,
  Sun,
  Home,
  Building,
  Map,
  Clock,
  Profile2User,
  Airplane,
  Security,
  CloseCircle,
  Location,
};

export default function Details() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { propertyId } = route.params as { propertyId: string };

  // Reanimated Shared Value for Scroll
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Floating Header Background Opacity
  const headerBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT / 2],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  // Hero Image Parallax & Scale
  const heroAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.3]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0],
            [2, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  // State for data
  const [resort, setResort] = useState<ResortDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Favorites hook
  const { isFavorite: checkIsFavorite, toggleFavorite: toggleFavoriteContext } = useFavorites();
  const isFavorite = checkIsFavorite(propertyId);

  // State for Toast
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new RNAnimated.Value(0)).current;

  // Image Viewer State
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  // Fetch resort details
  useEffect(() => {
    loadResortDetails();
  }, [propertyId]);

  const loadResortDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await resortService.getResortById(propertyId);
      setResort(data);
    } catch (err: any) {
      console.error('Error loading resort details:', err);
      setError(err.response?.data?.message || 'Failed to load resort details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    await toggleFavoriteContext(propertyId);
    if (!isFavorite) {
      showToastNotification(t('home.savedToast'));
    }
  };

  const showToastNotification = (message: string) => {
    setShowToast(true);
    RNAnimated.sequence([
      RNAnimated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      RNAnimated.delay(2000),
      RNAnimated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  };

  // Show loading state
  if (isLoading) {
    return <ResortDetailsSkeleton />;
  }

  // Show error state
  if (error || !resort) {
    return (
      <YStack flex={1} backgroundColor="#0a0a0a" justifyContent="center" alignItems="center" padding="$4">
        <Text color="white" fontSize={18} marginBottom="$4">Error</Text>
        <Text color="rgba(255, 255, 255, 0.6)" textAlign="center">{error || 'Resort not found'}</Text>
        <Button
          marginTop="$4"
          backgroundColor="#22c55e"
          onPress={() => navigation.goBack()}
        >
          Go Back
        </Button>
      </YStack>
    );
  }

  // Prepare data for display
  const sortedPhotos = resort.photos.sort((a, b) => a.order - b.order);
  const mainImage = sortedPhotos.length > 0 ? sortedPhotos[0].url : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200';
  const price = resort.promo && resort.promoPrice ? resort.promoPrice : resort.basePrice;

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryVisible(true);
  };

  const onMomentumScrollEnd = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlide(slideIndex);
  };

  return (
    <MotiView 
      style={{ flex: 1, backgroundColor: '#0a0a0a' }}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <View style={{ flex: 1 }}>
        {/* Floating Header (Absolute) */}
        <View style={[styles.floatingHeader, { paddingTop: insets.top }]}>
          {/* Animated Background */}
          <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#0a0a0a' }, headerBackgroundStyle]} />
          
          {/* Header Buttons */}
          <XStack
            paddingHorizontal="$4"
            paddingVertical="$2"
            justifyContent="space-between"
            alignItems="center"
          >
            <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
              <ArrowLeft size={28} color="#ffffff" />
            </Pressable>
            <XStack gap="$4" alignItems="center">
              <Pressable onPress={handleToggleFavorite} style={styles.iconButton}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isFavorite ? "#22c55e" : "#ffffff"}
                />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <More size={28} color="#ffffff" style={{ transform: [{ rotate: '90deg' }] }} />
              </Pressable>
            </XStack>
          </XStack>
        </View>

        {/* Main Content */}
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 180 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* Hero Image Section */}
          <Animated.View style={[styles.heroContainer, heroAnimatedStyle]}>
            <RNAnimated.FlatList
              data={sortedPhotos}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onMomentumScrollEnd}
              keyExtractor={(item) => item.url}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => openGallery(index)}>
                  <Image source={{ uri: item.url }} style={styles.heroImage} />
                </Pressable>
              )}
            />

            {/* Gradient Overlay for Visibility when Transparent */}
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent']}
              style={[styles.headerGradient, { height: insets.top + 80 }]}
              pointerEvents="none"
            />
            
            {/* Carousel Indicator */}
            {sortedPhotos.length > 1 && (
              <XStack
                position="absolute"
                bottom={20}
                left={0}
                right={0}
                justifyContent="center"
                gap="$2"
              >
                {sortedPhotos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicatorBar,
                      { backgroundColor: index === activeSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.4)' }
                    ]}
                  />
                ))}
              </XStack>
            )}
          </Animated.View>

          {/* Content Section */}
          <YStack paddingHorizontal="$4" paddingTop="$5" backgroundColor="#0a0a0a">
            {/* Title */}
            <Text fontSize={28} fontWeight="700" color="#ffffff" lineHeight={34}>
              {resort.name}
            </Text>

            {/* Address */}
            <XStack alignItems="center" gap="$2" marginTop="$2">
              <Location size={20} color="#22c55e" variant="Bold" />
              <Text fontSize={15} color="rgba(255, 255, 255, 0.7)">
                {resort.address || resort.city}
              </Text>
            </XStack>

            {/* About */}
            {resort.description && (
              <YStack marginTop="$6">
                <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$3">
                  {t('details.about')}
                </Text>
                <Text fontSize={15} color="rgba(255, 255, 255, 0.8)" lineHeight={24}>
                  {resort.description}
                </Text>
              </YStack>
            )}

            {/* Popular Amenities */}
            {resort.amenities && resort.amenities.length > 0 && (
              <YStack marginTop="$6">
                <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$4">
                  {t('details.amenities')}
                </Text>

                <RNScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                  <XStack gap="$4">
                    {resort.amenities.map((amenityKey) => {
                      const amenity = AMENITIES_MAP[amenityKey];
                      if (!amenity) return null;

                      const IconComponent = ICON_COMPONENTS[amenity.icon];
                      if (!IconComponent) return null;

                      return (
                        <YStack key={amenityKey} alignItems="center" gap="$2" width={80}>
                          <YStack
                            width={64}
                            height={64}
                            borderRadius={32}
                            backgroundColor="rgba(255, 255, 255, 0.05)"
                            justifyContent="center"
                            alignItems="center"
                            borderWidth={1}
                            borderColor="rgba(255, 255, 255, 0.1)"
                          >
                            <IconComponent size={28} color="#22c55e" />
                          </YStack>
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.7)" textAlign="center" numberOfLines={2}>
                            {amenity.label}
                          </Text>
                        </YStack>
                      );
                    })}
                  </XStack>
                </RNScrollView>

                {resort.amenities.length > 6 && (
                  <Pressable style={{ marginTop: 24 }}>
                    <XStack alignItems="center" gap="$2">
                      <Text fontSize={15} color="#22c55e" fontWeight="600">
                        {t('details.allAmenities')}
                      </Text>
                      <ArrowRight size={16} color="#22c55e" />
                    </XStack>
                  </Pressable>
                )}
              </YStack>
            )}

            {/* Photo Gallery */}
            {sortedPhotos.length > 0 && (
              <YStack marginTop="$6" marginBottom="$4">
                <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$4">
                  {t('details.photos')}
                </Text>
                <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$3">
                    {sortedPhotos.map((photo, index) => (
                      <Pressable key={index} onPress={() => openGallery(index)}>
                        <Image source={{ uri: photo.url }} style={styles.galleryImage} />
                      </Pressable>
                    ))}
                  </XStack>
                </RNScrollView>
              </YStack>
            )}
          </YStack>
        </Animated.ScrollView>

        {/* Full Screen Image Gallery */}
        <ImageViewerModal
          visible={galleryVisible}
          images={sortedPhotos}
          initialIndex={galleryIndex}
          onClose={() => setGalleryVisible(false)}
        />

        {/* Fixed Bottom Booking Bar */}
        <YStack position="absolute" bottom={0} left={0} right={0}>
          <BlurView intensity={80} tint="dark" style={styles.bookingBar}>
            <YStack padding="$4" paddingBottom={insets.bottom + 16} gap="$3">
              {/* Price Info Row */}
              <YStack>
                <XStack alignItems="baseline" gap="$1">
                  <Text fontSize={28} fontWeight="700" color="#ffffff">
                    ₸{price.toLocaleString()}
                  </Text>
                  <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">
                    {t('details.night')}
                  </Text>
                </XStack>
                <Text fontSize={12} color="rgba(255, 255, 255, 0.5)" marginTop={4}>
                  {t('details.excludesTaxes')}
                </Text>
              </YStack>

              {/* Button Row */}
              <XStack gap="$3">
                <Pressable
                  onPress={handleToggleFavorite}
                  style={[
                    styles.heartButton,
                    isFavorite && styles.heartButtonActive
                  ]}
                >
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={28}
                    color={isFavorite ? "#22c55e" : "#ffffff"}
                  />
                </Pressable>
                <Button
                  flex={1}
                  backgroundColor="#22c55e"
                  color="white"
                  height={56}
                  borderRadius={999}
                  fontSize={16}
                  fontWeight="600"
                  pressStyle={{ backgroundColor: '#16a34a' }}
                  onPress={() => navigation.navigate('SelectDate', {
                    property: {
                      id: resort.id,
                      name: resort.name,
                      location: resort.city,
                      price: price,
                      rating: resort.rating,
                      image: mainImage,
                      type: 'resort'
                    }
                  })}
                >
                  {t('details.reserve')}
                </Button>
              </XStack>
            </YStack>
          </BlurView>
        </YStack>

        {/* Toast Notification */}
        {showToast && (
          <RNAnimated.View style={[styles.toastContainer, { opacity: toastOpacity, top: insets.top + 60 }]}>
            <BlurView intensity={40} tint="dark" style={styles.toastBlur}>
              <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingVertical="$3">
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text color="white" fontWeight="600">{t('home.savedToast')}</Text>
              </XStack>
            </BlurView>
          </RNAnimated.View>
        )}
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  iconButton: {
    width: 40, 
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    width: width,
    height: HEADER_HEIGHT,
    overflow: 'hidden', // Ensure scale doesn't overflow drastically if needed, though usually desirable
  },
  heroImage: {
    width,
    height: HEADER_HEIGHT,
    backgroundColor: '#1a1a1a',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  indicatorBar: {
    width: 24,
    height: 3,
    borderRadius: 1.5,
  },
  galleryImage: {
    width: width * 0.42,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  bookingBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  heartButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heartButtonActive: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 200,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastBlur: {
    borderRadius: 999,
  }
});
