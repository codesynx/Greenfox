import { useState, useEffect } from 'react';
import { 
  ScrollView, 
  Image, 
  StyleSheet, 
  Pressable, 
  ActivityIndicator, 
  Modal, 
  TextInput, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { bookingService, BookingResponse } from '../services/bookingService';
import { Button } from '../components/Button';

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

const getStatusColor = (status: BookingResponse['status']) => {
  switch (status) {
    case 'PENDING':
    case 'PAID_WAITING':
    case 'CANCELLATION_PENDING':
      return '#fbbf24';
    case 'CONFIRMED':
      return '#22c55e';
    case 'COMPLETED':
      return 'rgba(255, 255, 255, 0.6)';
    case 'CANCELLED':
    case 'REJECTED':
      return '#ef4444';
    default:
      return 'rgba(255, 255, 255, 0.6)';
  }
};

const getStatusBgColor = (status: BookingResponse['status']) => {
  switch (status) {
    case 'PENDING':
    case 'PAID_WAITING':
    case 'CANCELLATION_PENDING':
      return 'rgba(251, 191, 36, 0.2)';
    case 'CONFIRMED':
      return 'rgba(34, 197, 94, 0.2)';
    case 'COMPLETED':
      return 'rgba(255, 255, 255, 0.1)';
    case 'CANCELLED':
    case 'REJECTED':
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
      return 'confirmed';
    case 'REJECTED':
      return 'rejected';
    case 'CANCELLATION_PENDING':
      return 'cancellation_pending';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return (status as string).toLowerCase();
  }
};

export default function BookingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // If unauthorized, just show empty state
      if (err.response?.status === 401) {
        setBookings([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPress = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCancellationReason('');
    setCancelModalVisible(true);
  };

  const submitCancellation = async () => {
    if (!selectedBookingId || !cancellationReason.trim()) return;
    
    try {
      setIsSubmitting(true);
      await bookingService.cancelBooking(selectedBookingId, cancellationReason);
      setCancelModalVisible(false);
      Alert.alert(t('bookings.cancellationReason'), t('bookings.cancelUnderReview'));
      loadBookings();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit cancellation request');
    } finally {
      setIsSubmitting(false);
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal="$4" paddingBottom="$20" gap="$4">
            {[1, 2, 3].map((i) => (
              <YStack
                key={i}
                borderRadius={16}
                overflow="hidden"
                backgroundColor="#1a1a1a"
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                {/* Image Area */}
                <SkeletonItem width="100%" height={180} borderRadius={0} />
                
                {/* Status Badge Placeholder */}
                <YStack position="absolute" top={16} right={16}>
                   <SkeletonItem width={80} height={24} borderRadius={12} />
                </YStack>

                <YStack padding="$4" gap="$3">
                  {/* Title Row */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <SkeletonItem width="60%" height={24} borderRadius={6} />
                  </XStack>

                  {/* Details Row */}
                  <XStack justifyContent="space-between">
                    <SkeletonItem width="30%" height={16} borderRadius={4} />
                    <SkeletonItem width="30%" height={16} borderRadius={4} />
                  </XStack>

                  <YStack height={1} backgroundColor="rgba(255,255,255,0.1)" marginVertical="$2" />

                  {/* Price */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack gap="$1">
                        <SkeletonItem width={60} height={12} borderRadius={4} />
                        <SkeletonItem width={100} height={20} borderRadius={6} />
                    </YStack>
                  </XStack>
                </YStack>
              </YStack>
            ))}
          </YStack>
        </ScrollView>
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
                <Pressable key={booking.id} onPress={() => (navigation as any).navigate('Details', { propertyId: booking.resortId })}>
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
                          <YStack>
                            <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                              {t('bookings.totalPrice')}
                            </Text>
                            <Text fontSize={20} fontWeight="700" color="#22c55e">
                              ₸{booking.totalPrice.toLocaleString()}
                            </Text>
                          </YStack>
                          
                          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                            <TouchableOpacity 
                              onPress={() => handleCancelPress(booking.id)}
                              style={styles.cancelButton}
                            >
                              <Text color="#ef4444" fontSize={12} fontWeight="600">
                                {t('bookings.cancelBooking')}
                              </Text>
                            </TouchableOpacity>
                          )}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelModalVisible}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <YStack 
              backgroundColor="#1a1a1a" 
              padding="$5" 
              borderRadius={24} 
              width="90%" 
              maxWidth={400}
              borderWidth={1}
              borderColor="rgba(255,255,255,0.1)"
            >
              <Text fontSize={20} fontWeight="700" color="white" marginBottom="$4">
                {t('bookings.cancelBooking')}
              </Text>
              
              <Text fontSize={14} color="rgba(255,255,255,0.7)" marginBottom="$2">
                {t('bookings.cancellationReason')}
              </Text>
              
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                maxLength={100}
                placeholderTextColor="rgba(255,255,255,0.3)"
                placeholder={t('bookings.cancellationReason')}
                value={cancellationReason}
                onChangeText={setCancellationReason}
              />
              <Text fontSize={12} color="rgba(255,255,255,0.5)" textAlign="right" marginBottom="$4">
                {cancellationReason.length}/100
              </Text>

              <XStack gap="$3" justifyContent="flex-end">
                <TouchableOpacity 
                  onPress={() => setCancelModalVisible(false)}
                  style={styles.modalButtonSecondary}
                >
                  <Text color="white" fontWeight="600">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={submitCancellation}
                  disabled={isSubmitting || !cancellationReason.trim()}
                  style={[
                    styles.modalButtonPrimary,
                    (!cancellationReason.trim() || isSubmitting) && styles.disabledButton
                  ]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text color="white" fontWeight="600">{t('bookings.cancelSubmit')}</Text>
                  )}
                </TouchableOpacity>
              </XStack>
            </YStack>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
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
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    color: 'white',
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtonSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
