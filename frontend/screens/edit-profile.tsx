import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, View, Alert, Animated, Image } from 'react-native';
import { YStack, XStack, Text, Input, Button, Spinner } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { Profile } from 'iconsax-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user, refreshProfile, optimisticAvatar, setOptimisticAvatar } = useAuth();

  const [name, setName] = useState('');
  const [phone] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const showToastNotification = () => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      if (isMounted.current) {
        setShowToast(false);
        // Navigate back after toast disappears
        setTimeout(() => {
          if (isMounted.current && navigation.canGoBack()) {
            navigation.goBack();
          }
        }, 100);
      }
    });
  };

  const handlePickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Optimistic UI: Show the local image immediately
        setOptimisticAvatar(asset.uri);

        // Upload in background
        uploadAvatarInBackground(asset.uri, asset.fileName || 'avatar.jpg', asset.mimeType || 'image/jpeg');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadAvatarInBackground = async (uri: string, fileName: string, mimeType: string) => {
    try {
      setIsUploadingAvatar(true);

      // Upload to backend
      await userService.uploadAvatar(uri, fileName, mimeType);

      // Silently update the profile with the returned URL
      await refreshProfile();

      // Update local state with server URL
      setOptimisticAvatar(null);
    } catch (error) {
      // Silent error handling - revert to previous avatar
      console.error('Failed to upload avatar:', error);
      setOptimisticAvatar(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      await userService.updateProfile({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });

      // Refresh the profile to get updated data
      await refreshProfile();

      // Show success toast
      showToastNotification();
    } catch (err: any) {
      const errorMessage = err.message || t('editProfile.errorSaving');
      Alert.alert(t('editProfile.errorTitle'), errorMessage);
    } finally {
      setIsLoading(false);
    }
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
                width={96}
                height={96}
                padding={4}
                backgroundColor="#0a0a0a"
                borderRadius={999}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
                alignItems="center"
                justifyContent="center"
              >
                {(optimisticAvatar || user?.avatarUrl) ? (
                  <Image
                    source={{ uri: optimisticAvatar || user?.avatarUrl! }}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 44,
                    }}
                  />
                ) : (
                  <YStack
                    width={88}
                    height={88}
                    borderRadius={999}
                    backgroundColor="rgba(34, 197, 94, 0.2)"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Profile size={48} color="#22c55e" variant="Bold" />
                  </YStack>
                )}
              </YStack>
              <Pressable style={styles.cameraButton} onPress={handlePickImage}>
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
                editable={false}
                keyboardType="phone-pad"
                backgroundColor="rgba(255,255,255,0.03)"
                borderColor="rgba(255,255,255,0.05)"
                borderRadius={16}
                color="rgba(255,255,255,0.5)"
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
            backgroundColor={isLoading ? 'rgba(34, 197, 94, 0.5)' : '#22c55e'}
            color="white"
            borderRadius={999}
            height={56}
            fontSize={16}
            fontWeight="700"
            pressStyle={{ backgroundColor: '#16a34a' }}
            onPress={handleSave}
            disabled={isLoading}
            icon={isLoading ? <Spinner color="white" /> : undefined}
          >
            {isLoading ? t('editProfile.saving') : t('editProfile.save')}
          </Button>
        </YStack>
      </KeyboardAvoidingView>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity, top: insets.top + 80 }]}>
          <BlurView intensity={40} tint="dark" style={styles.toastBlur}>
            <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingVertical="$3">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text color="white" fontWeight="600">{t('editProfile.profileSaved')}</Text>
            </XStack>
          </BlurView>
        </Animated.View>
      )}
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
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 200,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastBlur: {
    borderRadius: 999,
  },
});
