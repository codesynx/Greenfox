import { StyleSheet, Pressable, ScrollView, View } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

export default function TermsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <YStack flex={1} backgroundColor="#0a0a0a" paddingTop={insets.top}>
      <XStack paddingHorizontal="$4" paddingVertical="$4" alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <BlurView intensity={20} tint="light" style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </BlurView>
        </Pressable>
        <Text fontSize={18} fontWeight="700" color="#ffffff">{t('terms.title')}</Text>
        <View style={{ width: 40 }} />
      </XStack>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <YStack gap="$5">
          <YStack gap="$2">
            <Text fontSize={20} fontWeight="700" color="#22c55e">{t('terms.section1.title')}</Text>
            <Text fontSize={15} color="rgba(255,255,255,0.7)" lineHeight={24}>
              {t('terms.section1.body')}
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize={20} fontWeight="700" color="#22c55e">{t('terms.section2.title')}</Text>
            <Text fontSize={15} color="rgba(255,255,255,0.7)" lineHeight={24}>
              {t('terms.section2.body')}
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize={20} fontWeight="700" color="#22c55e">{t('terms.section3.title')}</Text>
            <Text fontSize={15} color="rgba(255,255,255,0.7)" lineHeight={24}>
              {t('terms.section3.body')}
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize={20} fontWeight="700" color="#22c55e">{t('terms.section4.title')}</Text>
            <Text fontSize={15} color="rgba(255,255,255,0.7)" lineHeight={24}>
              {t('terms.section4.body')}
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize={20} fontWeight="700" color="#22c55e">{t('terms.section5.title')}</Text>
            <Text fontSize={15} color="rgba(255,255,255,0.7)" lineHeight={24}>
              {t('terms.section5.body')}
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
