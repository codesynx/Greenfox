import { useState } from 'react';
import { ScrollView, StyleSheet, Pressable, FlatList, View } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your stay at Alakol Lake Resort has been confirmed for July 15-20.',
    time: '2 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Special Offer',
    message: 'Get 20% off your next booking in Almaty!',
    time: '5 hours ago',
    type: 'info',
    read: false,
  },
  {
    id: '3',
    title: 'Check-in Reminder',
    message: 'Don\'t forget to check in for your upcoming trip tomorrow.',
    time: '1 day ago',
    type: 'warning',
    read: true,
  },
  {
    id: '4',
    title: 'Payment Successful',
    message: 'Your payment for Caspian Sea Villa was successful.',
    time: '2 days ago',
    type: 'success',
    read: true,
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'alert-circle';
      case 'error': return 'close-circle';
      default: return 'information-circle';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'warning': return '#fbbf24';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable onPress={() => markAsRead(item.id)}>
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
            <Ionicons name={getIcon(item.type)} size={24} color={getColor(item.type)} />
          </YStack>
          
          <YStack flex={1} gap="$1">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <Text fontSize={16} fontWeight="700" color="#ffffff">{item.title}</Text>
              {!item.read && <YStack width={8} height={8} borderRadius={4} backgroundColor="#22c55e" />}
            </XStack>
            <Text fontSize={14} color="rgba(255,255,255,0.7)" lineHeight={20}>
              {item.message}
            </Text>
            <Text fontSize={12} color="rgba(255,255,255,0.4)" marginTop="$1">
              {item.time}
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

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <YStack alignItems="center" marginTop="$10">
            <Text color="rgba(255,255,255,0.5)">{t('notifications.empty', 'No notifications')}</Text>
          </YStack>
        }
      />
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
