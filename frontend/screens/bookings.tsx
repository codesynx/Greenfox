import { useState, useEffect } from 'react';
import { ScrollView, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { bookingService, BookingResponse } from '../services/bookingService';

const getStatusColor = (status: BookingResponse['status']) => {
  switch (status) {
    case 'PENDING':
    case 'PAID_WAITING':
      return '#fbbf24';
    case 'CONFIRMED':
      return '#22c55e';
    case 'COMPLETED':
      return 'rgba(255, 255, 255, 0.6)';
    case 'CANCELLED':
      return '#ef4444';
    default:
      return 'rgba(255, 255, 255, 0.6)';
  }
};

const getStatusBgColor = (status: BookingResponse['status']) => {
  switch (status) {
    case 'PENDING':
    case 'PAID_WAITING':
      return 'rgba(251, 191, 36, 0.2)';
    case 'CONFIRMED':
      return 'rgba(34, 197, 94, 0.2)';
    case 'COMPLETED':
      return 'rgba(255, 255, 255, 0.1)';
    case 'CANCELLED':
      return 'rgba(239, 68, 68, 0.2)';
    default:
      return 'rgba(255, 255, 255, 0.1)';
  }
};

const getStatusLabel = (status: BookingResponse['status']) => {
  switch (status) {
    case 'PENDING':
      return 'pending';
    case 'PAID_WAITING':
      return 'paid';
    case 'CONFIRMED':
      return 'upcoming';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return status.toLowerCase();
  }
};

export default function BookingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.content);
    } catch (err: any) {
      console.error('Error loading bookings:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      // If unauthorized, just show empty state
      if (err.response?.status === 401) {
        setBookings([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <YStack paddingHorizontal="$4" paddingTop={insets.top + 32} paddingBottom="$4">
        <Text fontSize={28} fontWeight="700" color="#ffffff">
          {t('bookings.title')}
        </Text>
        {!isLoading && (
          <Text fontSize={14} color="rgba(255, 255, 255, 0.6)" marginTop="$2">
            {bookings.length} {t('bookings.count')}
          </Text>
        )}
      </YStack>

      {isLoading ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color="#22c55e" />
        </YStack>
      ) : bookings.length === 0 ? (
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
            {bookings.map((booking) => {
              const image = booking.resortPhotoUrl || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800';

              return (
                <Pressable key={booking.id} onPress={() => (navigation as any).navigate('Details')}>
                  <YStack
                    marginBottom="$4"
                    borderRadius={16}
                    overflow="hidden"
                    style={styles.glassCard}
                  >
                    <Image source={{ uri: image }} style={styles.bookingImage} />
                    <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                      <YStack padding="$4">
                        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
                          <YStack flex={1}>
                            <Text fontSize={18} fontWeight="700" color="#ffffff" numberOfLines={1}>
                              {booking.resortName}
                            </Text>
                            <Text fontSize={14} color="rgba(255, 255, 255, 0.7)" marginTop="$1">
                              {booking.resortCity}
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
                              {t(`bookings.status.${getStatusLabel(booking.status)}`)}
                            </Text>
                          </YStack>
                        </XStack>

                        <XStack justifyContent="space-between" marginBottom="$3">
                          <YStack flex={1}>
                            <Text fontSize={12} color="rgba(255, 255, 255, 0.5)" marginBottom="$1">
                              {t('bookings.checkIn')}
                            </Text>
                            <Text fontSize={14} fontWeight="600" color="#ffffff">
                              {new Date(booking.checkInDate).toLocaleDateString('en-GB', {
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
                              {new Date(booking.checkOutDate).toLocaleDateString('en-GB', {
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
              );
            })}
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
