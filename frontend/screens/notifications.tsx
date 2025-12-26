import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, FlatList, View, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { notificationService, Notification } from '../services/notificationService';

const SkeletonItem = ({ 
  width: w, 
  height: h, 
  borderRadius = 4, 
  style 
}: { 
  width?: number | string; 
  height?: number | string; 
  borderRadius?: number;
  style?: any; 
}) => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 0.6 }}
    transition={{
      type: 'timing',
      duration: 1000,
      loop: true,
    }}
    style={[{
      width: w,
      height: h,
      backgroundColor: '#2C2C2C',
      borderRadius,
    }, style]}
  />
);

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.content);
      // Mark all as read when opening
      notificationService.markAllAsRead();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const getIcon = (type: string) => {
    if (type.includes('CONFIRMED') || type.includes('PAID') || type.includes('SUCCESS')) return 'checkmark-circle';
    if (type.includes('WARNING') || type.includes('REVIEW') || type.includes('PENDING')) return 'alert-circle';
    if (type.includes('ERROR') || type.includes('REJECTED') || type.includes('CANCELLED')) return 'close-circle';
    return 'information-circle';
  };

  const getColor = (type: string) => {
    if (type.includes('CONFIRMED') || type.includes('PAID') || type.includes('SUCCESS')) return '#22c55e';
    if (type.includes('WARNING') || type.includes('REVIEW') || type.includes('PENDING')) return '#fbbf24';
    if (type.includes('ERROR') || type.includes('REJECTED') || type.includes('CANCELLED')) return '#ef4444';
    return '#3b82f6';
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable>
      <BlurView intensity={10} tint="light" style={[styles.notificationCard, !item.read && styles.unreadBorder]}>
        <XStack padding="$4" gap="$3">
          <YStack 
            width={40} 
            height={40} 
            borderRadius={20} 
            backgroundColor={`${getColor(item.type)}20`} 
            alignItems="center" 
            justifyContent="center"
          >
            <Ionicons name={getIcon(item.type) as any} size={24} color={getColor(item.type)} />
          </YStack>
          
          <YStack flex={1} gap="$1">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <Text fontSize={16} fontWeight="700" color="#ffffff">{item.title}</Text>
              {!item.read && <YStack width={8} height={8} borderRadius={4} backgroundColor="#22c55e" />}
            </XStack>
            <Text fontSize={14} color="rgba(255,255,255,0.7)" lineHeight={20}>
              {item.message.startsWith('notification.') 
                ? t(item.message, { hotelName: item.metadata?.resortName || item.title || 'Resort' }) 
                : item.message}
            </Text>
            <Text fontSize={12} color="rgba(255,255,255,0.4)" marginTop="$1">
              {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </YStack>
        </XStack>
      </BlurView>
    </Pressable>
  );

  return (
    <YStack flex={1} backgroundColor="#0a0a0a" paddingTop={insets.top}>
      <XStack paddingHorizontal="$4" paddingVertical="$4" alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <BlurView intensity={20} tint="light" style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </BlurView>
        </Pressable>
        <Text fontSize={18} fontWeight="700" color="#ffffff">{t('notifications.title', 'Notifications')}</Text>
        <View style={{ width: 40 }} />
      </XStack>

      {isLoading && !refreshing ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BlurView key={i} intensity={10} tint="light" style={styles.notificationCard}>
              <XStack padding="$4" gap="$3">
                {/* Left Icon Skeleton */}
                <SkeletonItem width={40} height={40} borderRadius={20} />
                
                {/* Right Column Skeleton */}
                <YStack flex={1} gap="$2">
                  <XStack justifyContent="space-between">
                    <SkeletonItem width="80%" height={20} borderRadius={4} />
                  </XStack>
                  <SkeletonItem width="60%" height={16} borderRadius={4} />
                  <SkeletonItem width="20%" height={12} borderRadius={4} />
                </YStack>
              </XStack>
            </BlurView>
          ))}
        </ScrollView>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <YStack alignItems="center" marginTop="$10">
              <Text color="rgba(255,255,255,0.5)">{t('notifications.empty', 'No notifications')}</Text>
            </YStack>
          }
        />
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
  notificationCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  unreadBorder: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  }
});
