import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, ImageBackground, Pressable, ActivityIndicator, View, Dimensions } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { promoService, PromoResponse } from '../services/promoService';

// Animated Component
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PromoItem = ({ item, index, navigation, t }: { item: PromoResponse; index: number; navigation: any; t: any }) => {
  return (
    <AnimatedPressable 
        entering={FadeInDown.delay(index * 100).springify()} 
        layout={Layout.springify()}
        onPress={() => navigation.navigate('PromoDetails', { promo: item })}
        style={styles.itemContainer}
    >
      <View style={styles.cardContainer}>
        <ImageBackground
          source={{
            uri:
              item.bannerImageUrl ||
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 20 }}
        >
            {/* Dark Overlay */}
            <View style={styles.overlay} />
            
            <YStack flex={1} padding="$4" justifyContent="space-between">
                <YStack
                    backgroundColor="#22c55e"
                    paddingHorizontal="$3"
                    paddingVertical="$1"
                    borderRadius={100}
                    alignSelf="flex-start"
                >
                    <Text fontSize={12} fontWeight="700" color="white">
                        {item.discountPercent}% {t('home.off')}
                    </Text>
                </YStack>

                <YStack gap="$1">
                    <Text fontSize={20} fontWeight="700" color="#ffffff" numberOfLines={2} lineHeight={26}>
                        {item.title || item.resortName}
                    </Text>
                    
                    <XStack alignItems="center" gap="$1.5">
                        <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.8)" />
                        <Text fontSize={14} color="rgba(255, 255, 255, 0.9)" numberOfLines={1}>
                            {item.resortName}
                        </Text>
                    </XStack>
                </YStack>
            </YStack>
        </ImageBackground>
      </View>
    </AnimatedPressable>
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
    <View style={styles.container}>
      {/* Modal Navbar */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft} />
        
        <Text 
            fontSize={17} 
            fontWeight="600" 
            color="#ffffff" 
            textAlign="center"
            numberOfLines={1}
            style={{ flex: 1 }}
        >
            {t('home.specialOffers')}
        </Text>

        <View style={styles.headerRight}>
            <Pressable 
                onPress={() => navigation.goBack()}
                hitSlop={15}
                style={({pressed}) => ({ opacity: pressed ? 0.7 : 1 })}
            >
                <View style={styles.closeButton}>
                    <Ionicons name="close" size={20} color="#fff" />
                </View>
            </Pressable>
        </View>
      </View>

      {isLoading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color="#22c55e" />
        </YStack>
      ) : promos.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$6">
          <Ionicons name="pricetag-outline" size={48} color="rgba(255,255,255,0.3)" />
          <Text fontSize={18} fontWeight="600" color="#ffffff" textAlign="center" marginTop="$4">
            {t('home.noResorts')}
          </Text>
        </YStack>
      ) : (
        <FlatList
          data={promos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PromoItem 
                item={item} 
                index={index}
                navigation={navigation}
                t={t}
            />
          )}
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#0a0a0a',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerLeft: {
    width: 40,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    width: '100%',
  },
  cardContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
});
