import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, ImageBackground, View, Dimensions, Alert } from 'react-native';
import { Image } from 'expo-image';
import { YStack, XStack, Text, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { Profile } from 'iconsax-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

interface MenuItem {
  id: string;
  titleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  color?: string;
}

const accountItems: MenuItem[] = [
  { id: '1', titleKey: 'profile.personalInfo', icon: 'person-outline', route: 'EditProfile' },
];

const supportItems: MenuItem[] = [
  { id: '5', titleKey: 'profile.helpCenter', icon: 'help-circle-outline', route: 'HelpCenter' },
  { id: '6', titleKey: 'profile.terms', icon: 'document-text-outline', route: 'Terms' },
  { id: '7', titleKey: 'profile.privacy', icon: 'shield-checkmark-outline', route: 'Privacy' },
];

const MenuItem = ({ item, avatarUri }: { item: MenuItem; avatarUri?: string | null }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Pressable onPress={() => {
      if (item.route) {
        if (item.route === 'EditProfile') {
          (navigation as any).navigate(item.route, { avatarUri });
        } else {
          (navigation as any).navigate(item.route);
        }
      }
    }}>
      <BlurView intensity={20} tint="light" style={styles.menuItemBlur}>
        <XStack
          paddingVertical="$4"
          paddingHorizontal="$4"
          alignItems="center"
          backgroundColor="rgba(255, 255, 255, 0.05)"
        >
          <YStack 
            width={36} 
            height={36} 
            borderRadius={18} 
            backgroundColor="rgba(255,255,255,0.1)" 
            alignItems="center" 
            justifyContent="center"
            marginRight="$3"
          >
            <Ionicons name={item.icon} size={20} color="rgba(255, 255, 255, 0.9)" />
          </YStack>
          <Text flex={1} fontSize={16} color="#ffffff" fontWeight="500">
            {t(item.titleKey)}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.4)" />
        </XStack>
      </BlurView>
    </Pressable>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user, logout, refreshProfile, optimisticAvatar, setOptimisticAvatar } = useAuth();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Current avatar URI for navigation
  const currentAvatarUri = optimisticAvatar || user?.avatarUrl;

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setOptimisticAvatar(asset.uri);
        uploadAvatarInBackground(asset.uri, asset.fileName || 'avatar.jpg', asset.mimeType || 'image/jpeg');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadAvatarInBackground = async (uri: string, fileName: string, mimeType: string) => {
    try {
      setIsUploadingAvatar(true);
      await userService.uploadAvatar(uri, fileName, mimeType);
      await refreshProfile();
      setOptimisticAvatar(null); // Clear optimistic state to use real URL
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      // Silent error handling - revert to previous avatar
      setOptimisticAvatar(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-320, 0, 320],
            [160, 0, -320],
            Extrapolate.EXTEND
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-320, 0],
            [2, 1],
            { extrapolateRight: Extrapolate.CLAMP }
          ),
        },
      ],
    };
  });

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      {/* Fixed Background Layer */}
      <Animated.View 
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 320,
            zIndex: 0,
          }, 
          animatedHeaderStyle
        ]}
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' }}
          style={styles.headerBackground}
        >
          <LinearGradient
            colors={['rgba(10, 10, 10, 0.3)', 'rgba(10, 10, 10, 0.6)', '#0a0a0a']}
            style={styles.headerGradient}
            locations={[0, 0.6, 1]}
          />
        </ImageBackground>
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ zIndex: 1 }}
      >
        {/* Transparent Spacer */}
        <View style={{ height: 280 }} />

        {/* Profile Info Overlay - Now part of flow but overlapping */}
        <YStack alignItems="center" marginTop={-60} zIndex={1}>
          <YStack position="relative" marginBottom="$4">
            <Pressable onPress={handlePickImage}>
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
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
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
            </Pressable>

            <Pressable
              style={styles.editBadge}
              onPress={() => (navigation as any).navigate('EditProfile', { avatarUri: currentAvatarUri })}
            >
              <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
              <Ionicons name="pencil" size={14} color="#fff" />
            </Pressable>
          </YStack>

          <Text fontSize={28} fontWeight="700" color="#ffffff" marginBottom="$1">
            {user?.name || t('profile.user')}
          </Text>
          <Text fontSize={15} color="rgba(255, 255, 255, 0.6)" marginBottom="$4">
            {user?.phoneNumber || '+7 (___) ___-__-__'}
          </Text>
        </YStack>

        <YStack paddingHorizontal="$4" gap="$6">
          {/* Account Settings Section */}
          <YStack>
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$3" marginLeft="$2">
              {t('profile.account')}
            </Text>
            <YStack gap="$3">
              {accountItems.map((item) => (
                <MenuItem key={item.id} item={item} avatarUri={currentAvatarUri} />
              ))}
            </YStack>
          </YStack>

          {/* Support Section */}
          <YStack>
            <Text fontSize={18} fontWeight="700" color="#ffffff" marginBottom="$3" marginLeft="$2">
              {t('profile.support')}
            </Text>
            <YStack gap="$3">
              {supportItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </YStack>
          </YStack>

          {/* Logout Button */}
          <Pressable
            onPress={async () => {
              await logout();
              (navigation as any).navigate('Onboarding');
            }}
          >
            <BlurView intensity={10} tint="light" style={styles.logoutBlur}>
              <XStack
                paddingVertical="$4"
                paddingHorizontal="$4"
                alignItems="center"
                backgroundColor="rgba(239, 68, 68, 0.1)"
              >
                <YStack
                  width={36}
                  height={36}
                  borderRadius={18}
                  backgroundColor="rgba(239, 68, 68, 0.1)"
                  alignItems="center"
                  justifyContent="center"
                  marginRight="$3"
                >
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                </YStack>
                <Text flex={1} fontSize={16} color="#ef4444" fontWeight="600">
                  {t('profile.logout')}
                </Text>
              </XStack>
            </BlurView>
          </Pressable>
          
          <Text textAlign="center" fontSize={12} color="rgba(255,255,255,0.3)" marginTop="$2">
            {t('profile.version')} 1.0.0
          </Text>
        </YStack>
      </Animated.ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  editBadge: {
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
  menuItemBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
});
