import { useState, useRef } from 'react';
import { StyleSheet, Pressable, Animated, StatusBar } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { mockProperties, promoBanners, categories } from '../components/home/data';
import { PromoBanners } from '../components/home/PromoBanners';
import { CategoryList } from '../components/home/CategoryList';
import { PropertyCard } from '../components/home/PropertyCard';
import { LocationModal } from '../components/home/LocationModal';
import { FilterModal } from '../components/home/FilterModal';
import { SearchOverlay } from '../components/home/SearchOverlay';

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Interactive States
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Алматы');

  // Toast Animation
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
      showToastNotification(t('home.savedToast'));
    }
    setFavorites(newFavorites);
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <StatusBar barStyle="light-content" />
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <YStack paddingTop={insets.top + 20} paddingBottom="$4" gap="$6">
          
          {/* Header & Search */}
          <YStack paddingHorizontal="$4" gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <Pressable onPress={() => setLocationVisible(true)}>
                <XStack alignItems="center" gap="$2">
                   <Ionicons name="location-outline" size={16} color="#22c55e" />
                   <Text fontSize={15} color="#ffffff" fontWeight="600">
                     {currentLocation}
                   </Text>
                   <Ionicons name="chevron-down" size={14} color="rgba(255, 255, 255, 0.5)" />
                </XStack>
              </Pressable>
              <Pressable onPress={() => (navigation as any).navigate('Notifications')}>
                <BlurView intensity={20} tint="light" style={styles.notificationButton}>
                  <Ionicons name="notifications-outline" size={24} color="#ffffff" />
                  <YStack 
                    position="absolute" 
                    top={10} 
                    right={10} 
                    width={8} 
                    height={8} 
                    borderRadius={4} 
                    backgroundColor="#ef4444" 
                    borderWidth={1}
                    borderColor="#1a1a1a"
                  />
                </BlurView>
              </Pressable>
            </XStack>

            <Text fontSize={34} fontWeight="700" color="#ffffff" letterSpacing={-0.5}>
              {t('home.findStay')}
            </Text>

            <Pressable onPress={() => setSearchVisible(true)}>
              <XStack 
                backgroundColor="rgba(255, 255, 255, 0.08)"
                borderRadius={999}
                paddingHorizontal="$4"
                paddingVertical="$3"
                alignItems="center"
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
                <Text 
                  flex={1} 
                  color="rgba(255, 255, 255, 0.5)" 
                  fontSize={16} 
                  marginLeft="$3"
                >
                  {t('home.searchPlaceholder')}
                </Text>
                <Pressable 
                  style={styles.filterButton} 
                  onPress={(e) => {
                    e.stopPropagation();
                    setFilterVisible(true);
                  }}
                >
                  <Ionicons name="options-outline" size={20} color="#ffffff" />
                </Pressable>
              </XStack>
            </Pressable>
          </YStack>

          {/* Categories */}
          <CategoryList 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryPress={setActiveCategory}
          />

          {/* Promo Banners */}
          <PromoBanners banners={promoBanners} />

          {/* Popular Stays */}
          <YStack paddingHorizontal="$4" gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={20} fontWeight="700" color="#ffffff">{t('home.popularStays')}</Text>
            </XStack>
            
            <YStack gap="$5">
              {mockProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onPress={() => (navigation as any).navigate('Details')}
                  onFavoritePress={() => toggleFavorite(property.id)}
                />
              ))}
            </YStack>
          </YStack>
        </YStack>
      </Animated.ScrollView>

      {/* Location Modal */}
      <LocationModal 
        visible={locationVisible} 
        onClose={() => setLocationVisible(false)}
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />

      {/* Filter Modal */}
      <FilterModal 
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />

      {/* Search Overlay */}
      <SearchOverlay 
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity, top: insets.top + 60 }]}>
          <BlurView intensity={40} tint="dark" style={styles.toastBlur}>
            <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingVertical="$3">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text color="white" fontWeight="600">{toastMessage}</Text>
            </XStack>
          </BlurView>
        </Animated.View>
      )}

    </YStack>
  );
}

const styles = StyleSheet.create({
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 999,
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
