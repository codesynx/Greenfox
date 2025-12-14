import { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import { XStack, YStack, Text } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LANGUAGES } from './data';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (langCode: string) => Promise<void>;
}

export const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  useEffect(() => {
    if (showLanguageModal) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showLanguageModal]);

  const handleLanguageSelect = async (langCode: string) => {
    await onLanguageChange(langCode);
    setShowLanguageModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.languageButtonContainer, { top: insets.top + 16 }]}
        onPress={() => setShowLanguageModal(true)}
        activeOpacity={0.8}
      >
        <BlurView intensity={30} tint="dark" style={styles.languageButtonBlur}>
          <XStack alignItems="center" gap="$2" paddingHorizontal="$3" paddingVertical="$2">
            <Ionicons name="globe-outline" size={18} color="white" />
            <Text color="white" fontWeight="600" fontSize={14}>
              {LANGUAGES.find(l => l.code === currentLanguage)?.label || 'Русский'}
            </Text>
            <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.7)" />
          </XStack>
        </BlurView>
      </TouchableOpacity>

      <Modal
        visible={showLanguageModal}
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowLanguageModal(false)}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          </Animated.View>
        </Pressable>
        
        <YStack flex={1} justifyContent="center" alignItems="center" pointerEvents="box-none">
          <Animated.View 
            style={[
              styles.modalContent, 
              { 
                opacity: fadeAnim,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1]
                  })
                }]
              }
            ]}
          >
            <BlurView intensity={80} tint="dark" style={styles.modalBlurContent}>
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$4" paddingHorizontal="$2">
                <Text fontSize={18} fontWeight="700" color="white">
                  {t('language.select')}
                </Text>
                <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                  <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </XStack>
              
              <YStack gap="$2">
                {LANGUAGES.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      onPress={() => handleLanguageSelect(lang.code)}
                      activeOpacity={0.7}
                    >
                      <XStack 
                        alignItems="center" 
                        justifyContent="space-between"
                        paddingVertical="$3"
                        paddingHorizontal="$3"
                        borderRadius="$4"
                        backgroundColor={isSelected ? 'rgba(34, 197, 94, 0.15)' : 'transparent'}
                        borderWidth={1}
                        borderColor={isSelected ? 'rgba(34, 197, 94, 0.3)' : 'transparent'}
                      >
                        <XStack alignItems="center" gap="$3">
                          <Text 
                            fontSize={20}
                            opacity={isSelected ? 1 : 0.5}
                          >
                            {lang.code === 'en' ? '🇺🇸' : lang.code === 'ru' ? '🇷🇺' : '🇰🇿'}
                          </Text>
                          <Text
                            fontSize={16}
                            color={isSelected ? '#22c55e' : 'white'}
                            fontWeight={isSelected ? '600' : '500'}
                          >
                            {lang.label}
                          </Text>
                        </XStack>
                        
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                        )}
                      </XStack>
                    </TouchableOpacity>
                  );
                })}
              </YStack>
            </BlurView>
          </Animated.View>
        </YStack>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageButtonContainer: {
    position: 'absolute',
    left: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  languageButtonBlur: {
    // Container handles shape
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalBlurContent: {
    padding: 24,
    backgroundColor: 'rgba(30,30,30,0.85)',
  },
});
