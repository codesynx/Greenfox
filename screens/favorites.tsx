import { ScrollView, Image, StyleSheet, Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

const mockFavorites: Property[] = [
  {
    id: '1',
    name: 'Alakol Lake Resort',
    location: 'Alakol, Kazakhstan',
    price: 15000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  },
  {
    id: '2',
    name: 'Shymbulak Mountain Hotel',
    location: 'Almaty, Kazakhstan',
    price: 25000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  },
];

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <YStack paddingHorizontal="$4" paddingTop={insets.top + 32} paddingBottom="$4">
        <Text fontSize={28} fontWeight="700" color="#ffffff">
          {t('favorites.title')}
        </Text>
        <Text fontSize={14} color="rgba(255, 255, 255, 0.6)" marginTop="$2">
          {mockFavorites.length} {t('favorites.savedProperties')}
        </Text>
      </YStack>

      {mockFavorites.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$6">
          <Text fontSize={48} marginBottom="$4">
            💚
          </Text>
          <Text fontSize={20} fontWeight="600" color="#ffffff" textAlign="center" marginBottom="$2">
            {t('favorites.emptyTitle')}
          </Text>
          <Text fontSize={14} color="rgba(255, 255, 255, 0.6)" textAlign="center">
            {t('favorites.emptySubtitle')}
          </Text>
        </YStack>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal="$4" paddingBottom="$20">
            {mockFavorites.map((property) => (
              <Pressable key={property.id} onPress={() => (navigation as any).navigate('Details')}>
                <XStack
                  marginBottom="$4"
                  borderRadius={16}
                  overflow="hidden"
                  style={styles.glassCard}
                >
                  <Image source={{ uri: property.image }} style={styles.propertyImage} />
                  <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                    <YStack flex={1} padding="$3" justifyContent="space-between">
                      <YStack>
                        <Text fontSize={16} fontWeight="700" color="#ffffff" numberOfLines={1}>
                          {property.name}
                        </Text>
                        <Text fontSize={13} color="rgba(255, 255, 255, 0.7)" marginTop="$1">
                          {property.location}
                        </Text>
                        <XStack marginTop="$2" alignItems="center" gap="$1">
                          <Ionicons name="star" size={14} color="#fbbf24" />
                          <Text fontSize={14} fontWeight="600" color="#ffffff">
                            {property.rating}
                          </Text>
                        </XStack>
                      </YStack>
                      <XStack alignItems="baseline">
                        <Text fontSize={18} fontWeight="700" color="#22c55e">
                          ₸{property.price.toLocaleString()}
                        </Text>
                        <Text fontSize={12} fontWeight="400" color="rgba(255, 255, 255, 0.6)">
                          {' '}{t('favorites.night')}
                        </Text>
                      </XStack>
                    </YStack>
                  </BlurView>
                </XStack>
              </Pressable>
            ))}
          </YStack>
        </ScrollView>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  propertyImage: {
    width: 120,
    height: 140,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  glassCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});
