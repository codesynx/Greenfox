import { useState, useRef } from 'react';
import { ScrollView, Image, StyleSheet, Pressable, Dimensions, View, Animated } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Heart,
  More,
  Location,
  Wifi,
  Car,
  Coffee,
  Sun1,
  Weight,
  ArrowRight,
  Verify
} from 'iconsax-react-native';

const { width } = Dimensions.get('window');

const amenitiesData = [
  { id: '1', key: 'wifi', Icon: Wifi },
  { id: '2', key: 'pool', Icon: Sun1 },
  { id: '3', key: 'parking', Icon: Car },
  { id: '4', key: 'restaurant', Icon: Coffee },
  { id: '5', key: 'spa', Icon: Sun1 },
  { id: '6', key: 'gym', Icon: Weight },
];

export default function Details() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // State for Favorites and Toast
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
      showToastNotification(t('home.savedToast'));
    }
  };

  const showToastNotification = (message: string) => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  };

  // Mock data - in real app this would come from navigation params or API
  const property = {
    name: 'Alakol Lake Resort',
    location: 'Alakol, Kazakhstan',
    price: 15000,
    rating: 4.8,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400',
    ],
    description:
      'Experience luxury and tranquility at Alakol Lake Resort. Nestled along the pristine shores of Alakol Lake, our resort offers breathtaking views, world-class amenities, and unforgettable experiences. Perfect for families, couples, and solo travelers seeking relaxation and adventure.',
    host: {
      name: 'Kaspi Hotels',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
      verified: true,
    },
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        {/* Hero Image Section */}
        <YStack position="relative">
          <Image source={{ uri: property.image }} style={styles.heroImage} />
          
          {/* Transparent Header Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={[styles.headerGradient, { height: insets.top + 60 }]}
          />
          
          <XStack 
            position="absolute" 
            top={insets.top} 
            left={0} 
            right={0} 
            paddingHorizontal="$4" 
            paddingVertical="$2"
            justifyContent="space-between" 
            alignItems="center"
            zIndex={10}
          >
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft size={28} color="#ffffff" />
            </Pressable>
            <XStack gap="$4" alignItems="center">
              <Pressable onPress={toggleFavorite}>
                <Heart 
                  size={28} 
                  color={isFavorite ? "#ef4444" : "#ffffff"} 
                  variant={isFavorite ? "Bold" : "Linear"}
                />
              </Pressable>
              <Pressable>
                <More size={28} color="#ffffff" style={{ transform: [{ rotate: '90deg' }] }} />
              </Pressable>
            </XStack>
          </XStack>

          {/* Carousel Indicator */}
          <XStack 
            position="absolute" 
            bottom={20} 
            left={0} 
            right={0} 
            justifyContent="center" 
            gap="$2"
          >
            {property.images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicatorBar, 
                  { backgroundColor: index === 0 ? '#ffffff' : 'rgba(255, 255, 255, 0.4)' }
                ]} 
              />
            ))}
          </XStack>
        </YStack>

        {/* Content Section */}
        <YStack paddingHorizontal="$4" paddingTop="$5">
          {/* Title */}
          <Text fontSize={28} fontWeight="700" color="#ffffff" lineHeight={34}>
            {property.name}
          </Text>

          {/* Address */}
          <XStack alignItems="center" gap="$2" marginTop="$2">
            <Location size={20} color="#22c55e" variant="Bold" />
            <Text fontSize={15} color="rgba(255, 255, 255, 0.7)">
              {property.location}
            </Text>
          </XStack>

          {/* About */}
          <YStack marginTop="$6">
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$3">
              {t('details.about')}
            </Text>
            <Text fontSize={15} color="rgba(255, 255, 255, 0.8)" lineHeight={24}>
              {property.description}
            </Text>
          </YStack>

          {/* Popular Amenities */}
          <YStack marginTop="$6">
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$4">
              {t('details.amenities')}
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
              <XStack gap="$4">
                {amenitiesData.map((amenity) => (
                  <YStack key={amenity.id} alignItems="center" gap="$2" width={80}>
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
                      <amenity.Icon size={28} color="#22c55e" />
                    </YStack>
                    <Text fontSize={12} color="rgba(255, 255, 255, 0.7)" textAlign="center" numberOfLines={2}>
                      {t(`details.amenityList.${amenity.key}`)}
                    </Text>
                  </YStack>
                ))}
              </XStack>
            </ScrollView>

            <Pressable style={{ marginTop: 24 }}>
              <XStack alignItems="center" gap="$2">
                <Text fontSize={15} color="#22c55e" fontWeight="600">
                  {t('details.allAmenities')}
                </Text>
                <ArrowRight size={16} color="#22c55e" />
              </XStack>
            </Pressable>
          </YStack>

          {/* Photo Gallery */}
          <YStack marginTop="$6" marginBottom="$4">
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$4">
              {t('details.photos')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$3">
                {property.images.map((img, index) => (
                  <Pressable key={index}>
                    <Image source={{ uri: img }} style={styles.galleryImage} />
                  </Pressable>
                ))}
              </XStack>
            </ScrollView>
          </YStack>

        </YStack>
      </ScrollView>

      {/* Fixed Bottom Booking Bar */}
      <YStack position="absolute" bottom={0} left={0} right={0}>
        <BlurView intensity={80} tint="dark" style={styles.bookingBar}>
          <YStack padding="$4" paddingBottom={insets.bottom + 16} gap="$3">
            {/* Price Info Row */}
            <YStack>
              <XStack alignItems="baseline" gap="$1">
                <Text fontSize={28} fontWeight="700" color="#ffffff">
                  ₸{property.price.toLocaleString()}
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
                onPress={toggleFavorite}
                style={[
                  styles.heartButton,
                  isFavorite && styles.heartButtonActive
                ]}
              >
                <Heart 
                  size={28} 
                  color={isFavorite ? "#ef4444" : "#ffffff"} 
                  variant={isFavorite ? "Bold" : "Linear"}
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
                onPress={() => navigation.navigate('SelectDate', { property })}
              >
                {t('details.reserve')}
              </Button>
            </XStack>
          </YStack>
        </BlurView>
      </YStack>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity, top: insets.top + 60 }]}>
          <BlurView intensity={40} tint="dark" style={styles.toastBlur}>
            <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingVertical="$3">
              <Verify size={20} color="#22c55e" variant="Bold" />
              <Text color="white" fontWeight="600">{t('home.savedToast')}</Text>
            </XStack>
          </BlurView>
        </Animated.View>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width,
    height: 450,
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
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
