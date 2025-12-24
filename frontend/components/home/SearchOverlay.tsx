import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Pressable, Animated, Keyboard, FlatList, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text, Input } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchResortItem } from './SearchResortItem';
import { resortService, ResortListItem } from '../../services/resortService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_RESORTS = [
  { id: '1', name: 'Akbulak Resort', location: 'Almaty Region', rating: 4.8, price: 25000, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800' },
  { id: '2', name: 'Oi-Qaragai', location: 'Almaty', rating: 4.9, price: 35000, image: 'https://images.unsplash.com/photo-1571896349842-68c894913dbb?w=800' },
  { id: '3', name: 'Shymbulak Hotel', location: 'Medeu District', rating: 4.7, price: 45000, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
  { id: '4', name: 'Lesnaya Skazka', location: 'Almaty Area', rating: 4.6, price: 28000, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { id: '5', name: 'Tabagan', location: 'Almaty Region', rating: 4.5, price: 15000, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
];

const RECENT_SEARCHES_KEY = 'recent_searches';

export const SearchOverlay = ({ visible, onClose }: SearchOverlayProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const searchAnim = useRef(new Animated.Value(0)).current;

  const [query, setQuery] = useState('');
  const [localResults, setLocalResults] = useState<typeof MOCK_RESORTS>([]);
  const [backendResults, setBackendResults] = useState<ResortListItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'recent' | 'typing' | 'results'>('recent');

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches', error);
    }
  };

  const saveRecentSearch = async (term: string) => {
    try {
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search', error);
    }
  };

  const removeRecentSearch = async (term: string) => {
    try {
        const updated = recentSearches.filter(s => s !== term);
        setRecentSearches(updated);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to remove recent search', error);
    }
  }

  // Search Animation
  useEffect(() => {
    Animated.spring(searchAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      stiffness: 100,
      damping: 15,
      mass: 1,
    }).start();

    if (visible) {
      loadRecentSearches();
    } else {
      setQuery('');
      setSearchMode('recent');
      setBackendResults([]);
    }
  }, [visible]);

  const performBackendSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await resortService.getResorts({ query: searchQuery, size: 50 });
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setBackendResults(response.content);
      setSearchMode('results');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setQuery(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (text.trim().length === 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSearchMode('recent');
      setLocalResults([]);
      return;
    }

    // Local filtering immediately
    const filtered = MOCK_RESORTS.filter(r => 
      r.name.toLowerCase().includes(text.toLowerCase()) || 
      r.location.toLowerCase().includes(text.toLowerCase())
    );
    
    if (searchMode !== 'typing') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSearchMode('typing');
    }
    setLocalResults(filtered);

    // Debounce for backend search
    debounceTimeout.current = setTimeout(() => {
      performBackendSearch(text);
    }, 500);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleResultPress = (id: string, name: string) => {
    saveRecentSearch(name);
    handleClose();
    navigation.navigate('Details', { propertyId: id });
  };

  if (!visible && (searchAnim as any)._value === 0) return null;

  return (
    <Animated.View 
      style={[
        styles.searchOverlay, 
        { 
          opacity: searchAnim,
          transform: [
            {
              translateY: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            },
            {
              scale: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1]
              })
            }
          ]
        },
        !visible && { pointerEvents: 'none' }
      ]}
    >
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill}>
        <YStack flex={1} paddingTop={insets.top} paddingHorizontal="$4">
          <XStack alignItems="center" gap="$3" paddingVertical="$2">
            <Pressable onPress={handleClose}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <YStack flex={1}>
              <Input
                value={query}
                onChangeText={handleTextChange}
                autoFocus
                placeholder={t('home.search.placeholder')}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                backgroundColor="rgba(255, 255, 255, 0.1)"
                borderRadius={999}
                paddingHorizontal="$4"
                paddingVertical="$3"
                color="#ffffff"
                fontSize={16}
                onSubmitEditing={() => performBackendSearch(query)}
                returnKeyType="search"
              />
            </YStack>
            {loading && <ActivityIndicator color="white" size="small" />}
          </XStack>
          
          <YStack flex={1} marginTop="$4">
            {searchMode === 'recent' && recentSearches.length > 0 && (
              <YStack gap="$4">
                <Text fontSize={14} fontWeight="600" color="rgba(255,255,255,0.5)">
                  {t('home.search.recent')}
                </Text>
                {recentSearches.map((term) => (
                  <XStack key={term} justifyContent="space-between" alignItems="center">
                    <Pressable onPress={() => handleTextChange(term)} style={{ flex: 1, paddingVertical: 8 }}>
                        <XStack alignItems="center" gap="$2">
                            <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.3)" />
                            <Text fontSize={16} color="#ffffff">{term}</Text>
                        </XStack>
                    </Pressable>
                    <Pressable onPress={() => removeRecentSearch(term)} style={{ padding: 8 }}>
                        <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.3)" />
                    </Pressable>
                  </XStack>
                ))}
              </YStack>
            )}

            {searchMode === 'typing' && (
              <FlatList
                data={localResults}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <YStack marginBottom="$2">
                    <SearchResortItem
                      image={item.image}
                      name={item.name}
                      location={item.location}
                      rating={item.rating}
                      price={item.price}
                      onPress={() => handleResultPress(item.id, item.name)} 
                    />
                  </YStack>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
              />
            )}

            {searchMode === 'results' && (
              <YStack flex={1}>
                 <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                    <Text color="rgba(255,255,255,0.6)" fontSize={14} fontWeight="600">
                      Found {backendResults.length} results
                    </Text>
                 </XStack>
                 
                 <FlatList
                    data={backendResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <YStack marginBottom="$2">
                            <SearchResortItem
                                image={item.mainPhotoUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'}
                                name={item.name}
                                location={item.city}
                                rating={item.rating}
                                price={item.basePrice}
                                onPress={() => handleResultPress(item.id, item.name)}
                            />
                        </YStack>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                 />
              </YStack>
            )}
          </YStack>
        </YStack>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 110, // Higher than modal
  },
});
