import { useState, useEffect } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { YStack, XStack, Text, Input, Button, Avatar } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  
  const [name, setName] = useState('Abil Mansur');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('abil.mansur@example.com');

  useEffect(() => {
    AsyncStorage.getItem('userPhoneNumber').then((number) => {
      if (number) setPhone(number);
    });
  }, []);

  const handleSave = () => {
    // TODO: Implement save logic
    navigation.goBack();
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a" paddingTop={insets.top}>
      <XStack paddingHorizontal="$4" paddingVertical="$4" alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <BlurView intensity={20} tint="light" style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </BlurView>
        </Pressable>
        <Text fontSize={18} fontWeight="700" color="#ffffff">{t('editProfile.title')}</Text>
        <View style={{ width: 40 }} />
      </XStack>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <YStack alignItems="center" marginVertical="$6">
            <YStack position="relative">
              <YStack
                padding={4}
                backgroundColor="#0a0a0a"
                borderRadius={999}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
              >
                <Avatar circular size="$10">
                  <Avatar.Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200" />
                  <Avatar.Fallback backgroundColor="#22c55e" />
                </Avatar>
              </YStack>
              <Pressable style={styles.cameraButton}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                <Ionicons name="camera" size={14} color="#fff" />
              </Pressable>
            </YStack>
          </YStack>

          <YStack paddingHorizontal="$4" gap="$5">
            <YStack gap="$2">
              <Text color="rgba(255,255,255,0.6)" fontSize={14} marginLeft="$2">{t('editProfile.fullName')}</Text>
              <Input
                value={name}
                onChangeText={setName}
                backgroundColor="rgba(255,255,255,0.05)"
                borderColor="rgba(255,255,255,0.1)"
                borderRadius={16}
                color="#ffffff"
                fontSize={16}
                height={56}
                paddingHorizontal={20}
              />
            </YStack>

            <YStack gap="$2">
              <Text color="rgba(255,255,255,0.6)" fontSize={14} marginLeft="$2">{t('editProfile.phoneNumber')}</Text>
              <Input
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                backgroundColor="rgba(255,255,255,0.05)"
                borderColor="rgba(255,255,255,0.1)"
                borderRadius={16}
                color="#ffffff"
                fontSize={16}
                height={56}
                paddingHorizontal={20}
              />
            </YStack>

            <YStack gap="$2">
              <Text color="rgba(255,255,255,0.6)" fontSize={14} marginLeft="$2">{t('editProfile.email')}</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                backgroundColor="rgba(255,255,255,0.05)"
                borderColor="rgba(255,255,255,0.1)"
                borderRadius={16}
                color="#ffffff"
                fontSize={16}
                height={56}
                paddingHorizontal={20}
              />
            </YStack>
          </YStack>
        </ScrollView>

        <YStack padding="$4" paddingBottom={insets.bottom + 16}>
          <Button
            backgroundColor="#22c55e"
            color="white"
            borderRadius={999}
            height={56}
            fontSize={16}
            fontWeight="700"
            pressStyle={{ backgroundColor: '#16a34a' }}
            onPress={handleSave}
          >
            {t('editProfile.save')}
          </Button>
        </YStack>
      </KeyboardAvoidingView>
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
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0a0a0a',
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
  },
});
