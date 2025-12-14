import { useEffect, useRef } from 'react';
import { StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
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
  const filterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(filterAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible && (filterAnim as any)._value === 0) return null;

  return (
    <Animated.View 
      style={[
        styles.modalOverlay,
        { opacity: filterAnim },
        !visible && { pointerEvents: 'none' } // Prevent clicks when fading out
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View 
        style={[
          styles.modalContainer,
          {
            transform: [{
              translateY: filterAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0] // Slide up from 600px
              })
            }]
          }
        ]}
      >
        <BlurView intensity={90} tint="dark" style={styles.modalContent}>
          <YStack padding="$4" paddingBottom={insets.bottom + 20} gap="$4">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize={20} fontWeight="700" color="#ffffff">{t('home.filters.title')}</Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close-circle" size={28} color="rgba(255,255,255,0.5)" />
              </Pressable>
            </XStack>
            
            <YStack gap="$3">
              <Text fontSize={16} fontWeight="600" color="white">{t('home.filters.priceRange')}</Text>
              <XStack gap="$3">
                <Button flex={1} backgroundColor="rgba(255,255,255,0.1)" color="white" borderRadius="$4">{t('home.filters.lowToHigh')}</Button>
                <Button flex={1} backgroundColor="#22c55e" color="white" borderRadius="$4">{t('home.filters.highToLow')}</Button>
              </XStack>
            </YStack>

            <YStack gap="$3">
              <Text fontSize={16} fontWeight="600" color="white">{t('home.filters.propertyType')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2">
                  {['any', 'hotel', 'resort', 'villa', 'apartment'].map((type, i) => (
                    <Button 
                      key={type} 
                      backgroundColor={i === 0 ? '#22c55e' : 'rgba(255,255,255,0.1)'} 
                      color="white" 
                      borderRadius="$4" 
                      size="$3"
                    >
                      {t(`home.categories.${type}`)}
                    </Button>
                  ))}
                </XStack>
              </ScrollView>
            </YStack>
            
            <Button 
              backgroundColor="#22c55e" 
              color="white" 
              marginTop="$4" 
              borderRadius={999}
              fontWeight="700"
              height={56}
              onPress={onClose}
            >
              {t('home.filters.showResults')}
            </Button>
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
});
