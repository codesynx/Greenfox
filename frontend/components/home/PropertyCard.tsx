import { StyleSheet, Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Property } from './types';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

export const PropertyCard = ({ property, isFavorite, onPress, onFavoritePress }: PropertyCardProps) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.cardPressable}>
      <YStack style={styles.propertyCard}>
        <Image
          source={{ uri: property.image }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        
        {/* Favorite Button Overlay */}
        <Pressable 
          style={styles.favoriteButton} 
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
        >
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={isFavorite ? "#22c55e" : "#ffffff"} 
          />
        </Pressable>

        {/* Rating Badge */}
        <BlurView intensity={30} tint="dark" style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text fontSize={13} fontWeight="700" color="#ffffff" marginLeft="$1">
            {property.rating}
          </Text>
        </BlurView>

        {/* Gradient for text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />

        {/* Card Content */}
        <YStack style={styles.cardContent}>
          <XStack justifyContent="space-between" alignItems="flex-end">
            <YStack flex={1} marginRight="$3">
              <Text fontSize={20} fontWeight="700" color="#ffffff" numberOfLines={1}>
                {property.name}
              </Text>
              <XStack alignItems="center" marginTop="$1">
                <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.7)" />
                <Text fontSize={14} color="rgba(255, 255, 255, 0.7)" marginLeft="$1" numberOfLines={1}>
                  {property.location}
                </Text>
              </XStack>
            </YStack>
            <YStack alignItems="flex-end">
              <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" marginBottom="$1">{t('home.from')}</Text>
              <XStack alignItems="baseline">
                <Text fontSize={20} fontWeight="700" color="#22c55e">
                  ₸{property.price.toLocaleString()}
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">{t('home.night')}</Text>
              </XStack>
            </YStack>
          </XStack>
        </YStack>
      </YStack>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardPressable: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  propertyCard: {
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
