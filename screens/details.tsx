import { ScrollView, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface Amenity {
  id: string;
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const amenities: Amenity[] = [
  { id: '1', key: 'wifi', icon: 'wifi' },
  { id: '2', key: 'pool', icon: 'water' },
  { id: '3', key: 'parking', icon: 'car' },
  { id: '4', key: 'restaurant', icon: 'restaurant' },
  { id: '5', key: 'spa', icon: 'flower' },
  { id: '6', key: 'gym', icon: 'barbell' },
];

export default function Details() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Image with Gradient Fade */}
        <YStack position="relative">
          <Image source={{ uri: property.image }} style={styles.heroImage} />

          {/* Floating Back Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: insets.top + 16 }]}
          >
            <BlurView intensity={60} tint="dark" style={styles.backButtonBlur}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </BlurView>
          </Pressable>

          {/* Gradient Overlay - Fades to background */}
          <LinearGradient
            colors={['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.7)', '#0a0a0a']}
            style={styles.gradientOverlay}
            locations={[0, 0.7, 1]}
          />

          {/* Floating Info Card on Hero */}
          <YStack position="absolute" bottom={-40} left={16} right={16}>
            <BlurView intensity={60} tint="dark" style={styles.heroCard}>
              <YStack padding="$4">
                <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                  <YStack flex={1} marginRight="$3">
                    <Text fontSize={24} fontWeight="700" color="#ffffff" numberOfLines={2}>
                      {property.name}
                    </Text>
                    <XStack alignItems="center" marginTop="$2" gap="$1">
                      <Ionicons name="location" size={16} color="rgba(255, 255, 255, 0.7)" />
                      <Text fontSize={14} color="rgba(255, 255, 255, 0.7)">
                        {property.location}
                      </Text>
                    </XStack>
                  </YStack>
                  <YStack alignItems="flex-end">
                    <XStack alignItems="center" gap="$1">
                      <Ionicons name="star" size={20} color="#22c55e" />
                      <Text fontSize={20} fontWeight="700" color="#ffffff">
                        {property.rating}
                      </Text>
                    </XStack>
                    <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" marginTop="$1">
                      {property.reviews} {t('details.reviews')}
                    </Text>
                  </YStack>
                </XStack>
              </YStack>
            </BlurView>
          </YStack>
        </YStack>

        {/* Content Section */}
        <YStack paddingHorizontal="$4" paddingTop={60} paddingBottom="$24">
          {/* Host Info */}
          <YStack
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius={16}
            padding="$4"
            marginBottom="$5"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.1)"
          >
            <XStack alignItems="center" gap="$3">
              <Image source={{ uri: property.host.avatar }} style={styles.hostAvatar} />
              <YStack flex={1}>
                <XStack alignItems="center" gap="$2">
                  <Text fontSize={16} fontWeight="600" color="#ffffff">
                    {t('details.hostedBy')} {property.host.name}
                  </Text>
                  {property.host.verified && (
                    <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  )}
                </XStack>
                <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" marginTop="$1">
                  {t('details.verifiedHost')}
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {/* Description */}
          <YStack marginBottom="$5">
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$3">
              {t('details.about')}
            </Text>
            <Text fontSize={15} color="rgba(255, 255, 255, 0.8)" lineHeight={24}>
              {property.description}
            </Text>
          </YStack>

          {/* Amenities - 2 Column Grid */}
          <YStack marginBottom="$5">
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$3">
              {t('details.amenities')}
            </Text>
            <XStack flexWrap="wrap" gap="$3">
              {amenities.map((amenity) => (
                <XStack
                  key={amenity.id}
                  backgroundColor="rgba(255, 255, 255, 0.05)"
                  padding="$3"
                  borderRadius={12}
                  alignItems="center"
                  gap="$3"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.1)"
                  width="48%"
                >
                  <YStack
                    width={40}
                    height={40}
                    backgroundColor="rgba(34, 197, 94, 0.2)"
                    borderRadius={20}
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Ionicons name={amenity.icon} size={20} color="#22c55e" />
                  </YStack>
                  <Text fontSize={14} color="#ffffff" fontWeight="500" flex={1} numberOfLines={1}>
                    {t(`details.amenityList.${amenity.key}`)}
                  </Text>
                </XStack>
              ))}
            </XStack>
          </YStack>

          {/* Photo Gallery */}
          <YStack marginBottom="$5">
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$3">
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
          <YStack padding="$4" paddingBottom={insets.bottom + 16}>
            <XStack alignItems="center" justifyContent="space-between">
              <YStack flex={1} marginRight="$3">
                <XStack alignItems="baseline" gap="$1">
                  <Text fontSize={28} fontWeight="700" color="#22c55e">
                    ₸{property.price.toLocaleString()}
                  </Text>
                  <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">
                    {t('details.night')}
                  </Text>
                </XStack>
                <Text fontSize={12} color="rgba(255, 255, 255, 0.5)" marginTop="$1">
                  {t('details.excludesTaxes')}
                </Text>
              </YStack>
              <Button
                backgroundColor="#22c55e"
                color="white"
                paddingHorizontal="$8"
                height={56}
                borderRadius={999}
                fontSize={16}
                fontWeight="600"
                flexShrink={0}
                pressStyle={{ backgroundColor: '#16a34a' }}
              >
                {t('details.reserve')}
              </Button>
            </XStack>
          </YStack>
        </BlurView>
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width,
    height: 400,
    backgroundColor: '#1a1a1a',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  backButtonBlur: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  bookingBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
});
