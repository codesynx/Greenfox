import { useEffect, useRef } from 'react';
import { StyleSheet, Pressable, Animated, Keyboard } from 'react-native';
import { YStack, XStack, Text, Input } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ visible, onClose }: SearchOverlayProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const searchAnim = useRef(new Animated.Value(0)).current;

  // Search Animation
  useEffect(() => {
    Animated.spring(searchAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      stiffness: 100,
      damping: 15,
      mass: 1,
    }).start();
  }, [visible]);

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
                outputRange: [50, 0] // Slide up slightly
              })
            },
            {
              scale: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1] // Zoom in slightly
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
            <Pressable onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Input
              flex={1}
              autoFocus
              placeholder={t('home.search.placeholder')}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius={999}
              paddingHorizontal="$4"
              paddingVertical="$3"
              color="#ffffff"
              fontSize={16}
            />
          </XStack>
          
          <YStack marginTop="$6" gap="$4">
            <Text fontSize={14} fontWeight="600" color="rgba(255,255,255,0.5)">{t('home.search.recent')}</Text>
            {['Almaty Mountains', 'Caspian Sea', 'Luxury Villa'].map((term) => (
              <XStack key={term} justifyContent="space-between" alignItems="center">
                <Text fontSize={16} color="#ffffff">{term}</Text>
                <Ionicons name="close-outline" size={20} color="rgba(255,255,255,0.3)" />
              </XStack>
            ))}
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
