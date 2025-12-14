import { useState } from 'react';
import { StyleSheet, Pressable, ScrollView, View } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

export default function HelpCenterScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: t('helpCenter.faq1.q'),
      a: t('helpCenter.faq1.a'),
    },
    {
      q: t('helpCenter.faq2.q'),
      a: t('helpCenter.faq2.a'),
    },
    {
      q: t('helpCenter.faq3.q'),
      a: t('helpCenter.faq3.a'),
    },
    {
      q: t('helpCenter.faq4.q'),
      a: t('helpCenter.faq4.a'),
    }
  ];

  return (
    <YStack flex={1} backgroundColor="#0a0a0a" paddingTop={insets.top}>
      <XStack paddingHorizontal="$4" paddingVertical="$4" alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <BlurView intensity={20} tint="light" style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </BlurView>
        </Pressable>
        <Text fontSize={18} fontWeight="700" color="#ffffff">{t('helpCenter.title')}</Text>
        <View style={{ width: 40 }} />
      </XStack>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <YStack gap="$4">
          {faqs.map((faq, index) => (
            <Pressable 
              key={index} 
              onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <YStack
                backgroundColor="rgba(255,255,255,0.05)"
                borderRadius={16}
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                overflow="hidden"
              >
                <XStack padding="$4" justifyContent="space-between" alignItems="center">
                  <Text flex={1} fontSize={16} fontWeight="600" color="#ffffff">{faq.q}</Text>
                  <Ionicons 
                    name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="rgba(255,255,255,0.5)" 
                  />
                </XStack>
                {expandedIndex === index && (
                  <YStack paddingHorizontal="$4" paddingBottom="$4">
                    <Text fontSize={14} color="rgba(255,255,255,0.7)" lineHeight={22}>
                      {faq.a}
                    </Text>
                  </YStack>
                )}
              </YStack>
            </Pressable>
          ))}
        </YStack>

        <YStack marginTop="$8" alignItems="center" gap="$3">
          <Text fontSize={16} fontWeight="600" color="rgba(255,255,255,0.8)">{t('helpCenter.stillNeedHelp')}</Text>
          <Pressable style={styles.contactButton}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#22c55e" />
            <Text fontSize={16} fontWeight="600" color="#22c55e" marginLeft="$2">{t('helpCenter.chatSupport')}</Text>
          </Pressable>
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  }
});
