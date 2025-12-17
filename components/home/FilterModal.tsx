import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Slider } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal = ({ visible, onClose }: FilterModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  
  // State
  const [priceRange, setPriceRange] = useState([20000, 150000]);
  const [selectedType, setSelectedType] = useState('any');
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());

  useEffect(() => {
    Animated.spring(anim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      stiffness: 100,
      damping: 15,
      mass: 1,
    }).start();
  }, [visible]);

  if (!visible && (anim as any)._value === 0) return null;

  const amenitiesList = ['wifi', 'pool', 'parking', 'restaurant', 'spa', 'gym'];
  const propertyTypes = ['any', 'hotel', 'resort', 'villa', 'apartment'];

  const toggleAmenity = (amenity: string) => {
    const newSet = new Set(selectedAmenities);
    if (newSet.has(amenity)) newSet.delete(amenity);
    else newSet.add(amenity);
    setSelectedAmenities(newSet);
  };

  const formatPrice = (price: number) => {
    return `₸${price.toLocaleString()}`;
  };

  return (
    <Animated.View 
      style={[
        styles.modalOverlay,
        { 
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            },
            {
              scale: anim.interpolate({
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
        <YStack flex={1} paddingTop={insets.top}>
          {/* Header */}
          <XStack alignItems="center" paddingHorizontal="$4" paddingVertical="$4" gap="$4">
            <Pressable onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text fontSize={20} fontWeight="700" color="white">{t('home.filters.title')}</Text>
          </XStack>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
            {/* Price Range */}
            <YStack gap="$4" marginBottom="$6">
              <Text fontSize={16} fontWeight="600" color="white">{t('home.filters.priceRange')}</Text>
              
              {/* Histogram Simulation */}
              <XStack alignItems="flex-end" height={60} gap="$1" paddingHorizontal="$2" marginBottom="$2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <YStack 
                    key={i} 
                    flex={1} 
                    backgroundColor="#22c55e" 
                    opacity={0.3} 
                    height={`${Math.random() * 60 + 20}%`} 
                    borderRadius={2} 
                  />
                ))}
              </XStack>
              
              <Slider 
                defaultValue={[20000, 150000]} 
                max={500000} 
                step={1000} 
                onValueChange={(val) => setPriceRange(val as number[])}
              >
                <Slider.Track backgroundColor="rgba(255,255,255,0.1)" height={4}>
                  <Slider.TrackActive backgroundColor="#22c55e" />
                </Slider.Track>
                <Slider.Thumb index={0} circular size="$3" backgroundColor="white" borderWidth={2} borderColor="#22c55e" elevation={5} />
                <Slider.Thumb index={1} circular size="$3" backgroundColor="white" borderWidth={2} borderColor="#22c55e" elevation={5} />
              </Slider>

              <XStack justifyContent="space-between" marginTop="$2">
                <Text color="white" fontSize={16} fontWeight="600">{formatPrice(priceRange[0])}</Text>
                <Text color="white" fontSize={16} fontWeight="600">{formatPrice(priceRange[1])}</Text>
              </XStack>
            </YStack>

            {/* Property Type */}
            <YStack gap="$4" marginBottom="$6">
              <Text fontSize={16} fontWeight="600" color="white">{t('home.filters.propertyType')}</Text>
              <XStack flexWrap="wrap" gap="$3">
                {propertyTypes.map(type => (
                  <Pressable key={type} onPress={() => setSelectedType(type)}>
                    <XStack 
                      backgroundColor={selectedType === type ? '#22c55e' : 'rgba(255,255,255,0.08)'}
                      paddingHorizontal="$4" 
                      paddingVertical="$3" 
                      borderRadius={999}
                      borderWidth={1}
                      borderColor={selectedType === type ? '#22c55e' : 'rgba(255,255,255,0.1)'}
                    >
                      <Text color={selectedType === type ? 'black' : 'rgba(255,255,255,0.8)'} fontWeight="600" fontSize={14}>
                        {t(`home.categories.${type}`)}
                      </Text>
                    </XStack>
                  </Pressable>
                ))}
              </XStack>
            </YStack>

            {/* Amenities */}
            <YStack gap="$4">
              <XStack gap="$2" alignItems="center">
                <Text fontSize={16} fontWeight="600" color="white">{t('details.amenities')}</Text>
                <Ionicons name="information-circle" size={16} color="rgba(255,255,255,0.5)" />
              </XStack>
              <XStack flexWrap="wrap" gap="$3">
                {amenitiesList.map(item => {
                  const isSelected = selectedAmenities.has(item);
                  return (
                    <Pressable key={item} onPress={() => toggleAmenity(item)}>
                      <XStack 
                        backgroundColor={isSelected ? '#22c55e' : 'rgba(255,255,255,0.08)'}
                        paddingHorizontal="$4" 
                        paddingVertical="$3" 
                        borderRadius={999}
                        borderWidth={1}
                        borderColor={isSelected ? '#22c55e' : 'rgba(255,255,255,0.1)'}
                      >
                        <Text color={isSelected ? 'black' : 'rgba(255,255,255,0.8)'} fontWeight="600" fontSize={14}>
                          {t(`details.amenityList.${item}`)}
                        </Text>
                      </XStack>
                    </Pressable>
                  );
                })}
              </XStack>
            </YStack>
          </ScrollView>

          {/* Footer Buttons */}
          <XStack padding="$4" gap="$3" paddingBottom={insets.bottom + 10} backgroundColor="transparent">
            <Button 
              flex={1} 
              backgroundColor="transparent" 
              borderColor="rgba(255,255,255,0.5)" 
              borderWidth={1} 
              color="white" 
              borderRadius={999} 
              height={56} 
              fontSize={16}
              fontWeight="600"
              onPress={() => {
                setPriceRange([20000, 150000]);
                setSelectedType('any');
                setSelectedAmenities(new Set());
              }}
            >
              {t('home.filters.reset')}
            </Button>
            <Button 
              flex={1} 
              backgroundColor="#22c55e" 
              color="black" 
              borderRadius={999} 
              height={56} 
              fontSize={16}
              fontWeight="700"
              onPress={onClose}
            >
              {t('home.filters.apply')}
            </Button>
          </XStack>
        </YStack>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
});
