import { ScrollView, Image, StyleSheet, Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  image: string;
  totalPrice: number;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    propertyName: 'Alakol Lake Resort',
    location: 'Alakol, Kazakhstan',
    checkIn: '2025-12-20',
    checkOut: '2025-12-25',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    totalPrice: 75000,
  },
  {
    id: '2',
    propertyName: 'Shymbulak Mountain Hotel',
    location: 'Almaty, Kazakhstan',
    checkIn: '2025-11-15',
    checkOut: '2025-11-18',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    totalPrice: 75000,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return '#22c55e';
    case 'completed':
      return 'rgba(255, 255, 255, 0.6)';
    case 'cancelled':
      return '#ef4444';
    default:
      return 'rgba(255, 255, 255, 0.6)';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'rgba(34, 197, 94, 0.2)';
    case 'completed':
      return 'rgba(255, 255, 255, 0.1)';
    case 'cancelled':
      return 'rgba(239, 68, 68, 0.2)';
    default:
      return 'rgba(255, 255, 255, 0.1)';
  }
};

export default function BookingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <YStack paddingHorizontal="$4" paddingTop={insets.top + 32} paddingBottom="$4">
        <Text fontSize={28} fontWeight="700" color="#ffffff">
          {t('bookings.title')}
        </Text>
        <Text fontSize={14} color="rgba(255, 255, 255, 0.6)" marginTop="$2">
          {mockBookings.length} {t('bookings.count')}
        </Text>
      </YStack>

      {mockBookings.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$6">
          <Text fontSize={48} marginBottom="$4">
            📅
          </Text>
          <Text fontSize={20} fontWeight="600" color="#ffffff" textAlign="center" marginBottom="$2">
            {t('bookings.emptyTitle')}
          </Text>
          <Text fontSize={14} color="rgba(255, 255, 255, 0.6)" textAlign="center">
            {t('bookings.emptySubtitle')}
          </Text>
        </YStack>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal="$4" paddingBottom="$20">
            {mockBookings.map((booking) => (
              <Pressable key={booking.id} onPress={() => (navigation as any).navigate('Details')}>
                <YStack
                  marginBottom="$4"
                  borderRadius={16}
                  overflow="hidden"
                  style={styles.glassCard}
                >
                  <Image source={{ uri: booking.image }} style={styles.bookingImage} />
                  <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                    <YStack padding="$4">
                      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
                        <YStack flex={1}>
                          <Text fontSize={18} fontWeight="700" color="#ffffff" numberOfLines={1}>
                            {booking.propertyName}
                          </Text>
                          <Text fontSize={14} color="rgba(255, 255, 255, 0.7)" marginTop="$1">
                            {booking.location}
                          </Text>
                        </YStack>
                        <YStack
                          paddingHorizontal="$3"
                          paddingVertical="$1"
                          backgroundColor={getStatusBgColor(booking.status)}
                          borderRadius={999}
                          marginLeft="$2"
                          flexShrink={0}
                        >
                          <Text
                            fontSize={12}
                            fontWeight="600"
                            color={getStatusColor(booking.status)}
                            textTransform="capitalize"
                          >
                            {t(`bookings.status.${booking.status}`)}
                          </Text>
                        </YStack>
                      </XStack>

                      <XStack justifyContent="space-between" marginBottom="$3">
                        <YStack flex={1}>
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.5)" marginBottom="$1">
                            {t('bookings.checkIn')}
                          </Text>
                          <Text fontSize={14} fontWeight="600" color="#ffffff">
                            {new Date(booking.checkIn).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </Text>
                        </YStack>
                        <YStack flex={1}>
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.5)" marginBottom="$1">
                            {t('bookings.checkOut')}
                          </Text>
                          <Text fontSize={14} fontWeight="600" color="#ffffff">
                            {new Date(booking.checkOut).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </Text>
                        </YStack>
                      </XStack>

                      <XStack
                        borderTopWidth={1}
                        borderTopColor="rgba(255, 255, 255, 0.1)"
                        paddingTop="$3"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                          {t('bookings.totalPrice')}
                        </Text>
                        <Text fontSize={20} fontWeight="700" color="#22c55e">
                          ₸{booking.totalPrice.toLocaleString()}
                        </Text>
                      </XStack>
                    </YStack>
                  </BlurView>
                </YStack>
              </Pressable>
            ))}
          </YStack>
        </ScrollView>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  bookingImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  glassCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurContainer: {
    overflow: 'hidden',
  },
});
