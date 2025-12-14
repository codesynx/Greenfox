import { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Pressable, Animated, Dimensions, SectionList, View } from 'react-native';
import { YStack, XStack, Text, Input } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { majorCities, otherCities } from './data';

const { height } = Dimensions.get('window');

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

interface Section {
  title: string;
  data: string[];
}

export const LocationModal = ({ visible, onClose, currentLocation, onSelectLocation }: LocationModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const locationAnim = useRef(new Animated.Value(0)).current;
  const [locationSearch, setLocationSearch] = useState('');

  // Location Modal Animation
  useEffect(() => {
    Animated.timing(locationAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const sections: Section[] = useMemo(() => {
    let filteredMajor = majorCities;
    let filteredOther = otherCities;

    if (locationSearch) {
      const search = locationSearch.toLowerCase();
      filteredMajor = majorCities.filter(c => c.toLowerCase().includes(search));
      filteredOther = otherCities.filter(c => c.toLowerCase().includes(search));
    }

    const result: Section[] = [];

    if (filteredMajor.length > 0) {
      result.push({ title: '', data: filteredMajor });
    }

    // Group other cities by first letter
    const grouped: { [key: string]: string[] } = {};
    filteredOther.forEach(city => {
      const letter = city.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(city);
    });

    Object.keys(grouped).sort().forEach(letter => {
      result.push({ title: letter, data: grouped[letter] });
    });

    return result;
  }, [locationSearch, t]);

  if (!visible && (locationAnim as any)._value === 0) return null;

  return (
    <Animated.View 
      style={[
        styles.modalOverlay,
        { opacity: locationAnim },
        !visible && { pointerEvents: 'none' }
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View 
        style={[
          styles.modalContainer,
          {
            height: height * 0.65, // Medium detent height
            transform: [{
              translateY: locationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0]
              })
            }]
          }
        ]}
      >
        <BlurView intensity={90} tint="dark" style={[styles.modalContent, { flex: 1 }]}>
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <YStack paddingHorizontal="$4" paddingBottom={insets.bottom} gap="$4" flex={1}>
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={20} fontWeight="700" color="#ffffff">{t('home.locationLabel')}</Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close-circle" size={28} color="rgba(255,255,255,0.5)" />
              </Pressable>
            </XStack>

            {/* Search Bar with Icon */}
            <XStack 
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius={12}
              paddingHorizontal="$3"
              alignItems="center"
              height={48}
            >
              <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" />
              <Input
                flex={1}
                value={locationSearch}
                onChangeText={setLocationSearch}
                placeholder={t('home.searchPlaceholder')}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                backgroundColor="transparent"
                borderWidth={0}
                height="100%"
                color="#ffffff"
                fontSize={16}
                marginLeft="$2"
              />
            </XStack>
            
            {/* Cities SectionList */}
            <SectionList
              sections={sections}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderSectionHeader={({ section: { title } }) => (
                <Text 
                  fontSize={14} 
                  fontWeight="600" 
                  color="rgba(255,255,255,0.5)" 
                  marginTop="$4" 
                  marginBottom="$2"
                  marginLeft="$2"
                >
                  {title}
                </Text>
              )}
              renderItem={({ item, index, section }) => {
                const isSelected = currentLocation === item;
                const isFirst = index === 0;
                const isLast = index === section.data.length - 1;

                return (
                  <Pressable 
                    onPress={() => {
                      onSelectLocation(item);
                      onClose();
                      setLocationSearch('');
                    }}
                  >
                    <YStack
                      backgroundColor="rgba(255, 255, 255, 0.08)"
                      borderTopLeftRadius={isFirst ? 16 : 0}
                      borderTopRightRadius={isFirst ? 16 : 0}
                      borderBottomLeftRadius={isLast ? 16 : 0}
                      borderBottomRightRadius={isLast ? 16 : 0}
                      paddingHorizontal="$4"
                      paddingVertical="$3.5"
                    >
                      <XStack alignItems="center" justifyContent="space-between">
                        <Text 
                          fontSize={16} 
                          fontWeight={majorCities.includes(item) ? "600" : "500"} 
                          color={isSelected ? '#22c55e' : '#ffffff'}
                        >
                          {item}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark" size={20} color="#22c55e" />
                        )}
                      </XStack>
                      {/* Separator inside the block */}
                      {!isLast && (
                        <View style={styles.itemSeparator} />
                      )}
                    </YStack>
                  </Pressable>
                );
              }}
            />
          </YStack>
        </BlurView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  itemSeparator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  }
});
