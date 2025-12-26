import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, LayoutAnimation, Platform, UIManager, Alert, ActivityIndicator } from 'react-native';
import { YStack, XStack, Text, Button, Image, Separator } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowDown2, Add } from 'iconsax-react-native';
import { PaymentIcon } from 'react-native-payment-card-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { useAuth } from '../context/AuthContext';
import { bookingService, BookingCalcResponse } from '../services/bookingService';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const SkeletonItem = ({ width: w, height: h, borderRadius = 4, style }: any) => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 0.6 }}
    transition={{ type: 'timing', duration: 1000, loop: true }}
    style={[{ width: w, height: h, backgroundColor: '#2C2C2C', borderRadius }, style]}
  />
);

export default function PaymentScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  // Get data from params
  const { property, startDate, endDate, guestCount, adults, children, guestDetails } = (route.params as any) || {};

  // Helper to format dates
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [priceDetails, setPriceDetails] = useState<BookingCalcResponse | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!property) return;
      
      try {
        setLoadingPrice(true);
        const data = await bookingService.calculatePrice({
          resortId: property.id,
          checkInDate: startDate,
          checkOutDate: endDate,
          adults: adults || 1,
          children: children || 0
        });
        setPriceDetails(data);
      } catch (error) {
        console.error('Price calculation failed:', error);
        Alert.alert('Error', 'Failed to calculate price');
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [property, startDate, endDate, adults, children]);

  useEffect(() => {
      const params = route.params as any;
      if (params?.newCard) {
          const newCard = params.newCard;
          setSavedCards(prev => {
              if (prev.some(c => c.id === newCard.id)) return prev;
              return [...prev, newCard];
          });
          // Auto select new card
          setPaymentMethod(newCard.id);
      }
  }, [route.params]);

  if (!property) {
      return (
          <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#0a0a0a">
              <Text color="white">No property data found.</Text>
          </YStack>
      );
  }

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getPaymentMethodLabel = (methodId: string) => {
      const card = savedCards.find(c => c.id === methodId);
      if (card) return card.label;
      return t('payment.paymentMethod');
  };

  const getPaymentMethodIcon = (methodId: string) => {
      const card = savedCards.find(c => c.id === methodId);
      if (card) {
          return <PaymentIcon type={card.type} variant="logo" width={32} height={20} />;
      }
      return <PaymentIcon type="generic-card" variant="logo" width={32} height={20} />;
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    try {
        const selectedCard = savedCards.find(c => c.id === paymentMethod);
        
        const payload = {
            resortId: property.id,
            checkInDate: startDate,
            checkOutDate: endDate,
            adults: adults || 1,
            children: children || 0,
            guestFullName: guestDetails?.fullName || '',
            idNumber: guestDetails?.idNumber || '',
            idType: (guestDetails?.idType || 'IIN').toUpperCase(),
            phoneNumber: user?.phoneNumber || '',
            paymentMethod: {
                type: 'CARD' as const,
                cardToken: selectedCard?.id || 'mock-token',
                last4: selectedCard?.last4 || '0000'
            }
        };

        await bookingService.createBooking(payload);
        
        // Navigate to Success Page
        navigation.navigate('BookingSuccess' as any);
        
    } catch (error) {
        console.error('Booking failed:', error);
        Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <YStack paddingTop={insets.top} flex={1}>
        
        {/* Header */}
        <XStack paddingHorizontal="$4" paddingVertical="$4" alignItems="center" gap="$4">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={28} color="#ffffff" />
          </Pressable>
          <Text fontSize={20} fontWeight="700" color="#ffffff">{t('payment.title')}</Text>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          <YStack paddingHorizontal="$4" gap="$6">
            
            {/* Property Card */}
            <XStack gap="$4" alignItems="center">
                <Image 
                    source={{ uri: property.image || "https://via.placeholder.com/100" }} 
                    width={100} 
                    height={100} 
                    borderRadius={16}
                    backgroundColor="#1a1a1a"
                />
                <YStack justifyContent="center" flex={1} gap="$1">
                    <Text fontSize={18} fontWeight="700" color="#ffffff" numberOfLines={1}>{property.name}</Text>
                    <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">
                        {formatDate(startDate)} - {formatDate(endDate)}
                    </Text>
                    <Text fontSize={18} color="#ffffff" fontWeight="700" marginTop="$1">
                        ₸{(property.price || 0).toLocaleString()}
                    </Text>
                </YStack>
            </XStack>

            {/* Detail Section */}
            <YStack gap="$4">
              <Text fontSize={18} fontWeight="600" color="#ffffff">{t('payment.priceDetails')}</Text>
              
              <YStack gap="$3">
                {loadingPrice ? (
                  <>
                    <XStack justifyContent="space-between"><SkeletonItem width={120} height={20} /><SkeletonItem width={80} height={20} /></XStack>
                    <XStack justifyContent="space-between"><SkeletonItem width={100} height={20} /><SkeletonItem width={90} height={20} /></XStack>
                    <XStack justifyContent="space-between"><SkeletonItem width={80} height={20} /><SkeletonItem width={60} height={20} /></XStack>
                    <Separator borderColor="rgba(255,255,255,0.1)" marginVertical="$2" />
                    <XStack justifyContent="space-between" alignItems="center">
                      <SkeletonItem width={60} height={24} />
                      <SkeletonItem width={120} height={32} />
                    </XStack>
                  </>
                ) : priceDetails ? (
                  <>
                    {/* 1. Original Price (if discount) */}
                    {priceDetails.discountPercent > 0 && (
                      <XStack justifyContent="space-between">
                          <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('payment.roomFee')}</Text>
                          <Text fontSize={16} fontWeight="400" color="rgba(255, 255, 255, 0.4)" textDecorationLine="line-through">
                            ₸{(priceDetails.baseTotal || 0).toLocaleString()}
                          </Text>
                      </XStack>
                    )}

                    {/* 2. Discount Amount (if discount) */}
                    {priceDetails.discountPercent > 0 && (
                        <XStack justifyContent="space-between" alignItems="center">
                             <XStack gap="$2" alignItems="center">
                                <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('payment.discountAmount')}</Text>
                                <View style={{ backgroundColor: '#ef4444', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                                    <Text fontSize={12} color="white" fontWeight="700">-{priceDetails.discountPercent}%</Text>
                                </View>
                            </XStack>
                            <Text fontSize={16} fontWeight="600" color="#ef4444">- ₸{(priceDetails.discountAmount || 0).toLocaleString()}</Text>
                        </XStack>
                    )}

                    {/* 3. Price with Discount (or just Room Fee) */}
                    <XStack justifyContent="space-between">
                        <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">
                          {priceDetails.discountPercent > 0 ? t('payment.priceWithDiscount') : t('payment.roomFee')}
                        </Text>
                        <Text fontSize={16} fontWeight="600" color="#ffffff">₸{(priceDetails.discountedPrice || 0).toLocaleString()}</Text>
                    </XStack>

                    {/* 4. Taxes */}
                    <XStack justifyContent="space-between">
                        <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('payment.taxes')}</Text>
                        <Text fontSize={16} fontWeight="600" color="#ffffff">₸{(priceDetails.tax || 0).toLocaleString()}</Text>
                    </XStack>
                    
                    {/* 5. Total */}
                    <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
                        <Text fontSize={20} fontWeight="600" color="#ffffff">{t('payment.total')}</Text>
                        <Text fontSize={24} fontWeight="700" color="#22c55e">₸{(priceDetails.totalPrice || 0).toLocaleString()}</Text>
                    </XStack>
                  </>
                ) : (
                  <Text color="#ef4444">Failed to load price.</Text>
                )}
              </YStack>
            </YStack>

            {/* Select Payment Section */}
            <YStack gap="$4">
              <Text fontSize={18} fontWeight="600" color="#ffffff">{t('payment.paymentMethod')}</Text>
              
              <YStack>
                  <Pressable onPress={toggleDropdown}>
                    <XStack 
                        padding="$4" 
                        backgroundColor="rgba(255, 255, 255, 0.05)"
                        borderRadius={16}
                        borderWidth={1}
                        borderColor="rgba(255, 255, 255, 0.1)"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <XStack gap="$3" alignItems="center">
                            {savedCards.length > 0 && paymentMethod ? getPaymentMethodIcon(paymentMethod) : null}
                            <Text fontSize={16} color="#ffffff">{paymentMethod ? getPaymentMethodLabel(paymentMethod) : t('payment.paymentMethod')}</Text>
                        </XStack>
                        <ArrowDown2 
                            size={20} 
                            color="#ffffff" 
                            style={{ 
                                transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }] 
                            }} 
                        />
                    </XStack>
                  </Pressable>

                  {isDropdownOpen && (
                      <YStack 
                        marginTop="$2" 
                        backgroundColor="rgba(255, 255, 255, 0.05)"
                        borderRadius={16}
                        borderWidth={1}
                        borderColor="rgba(255, 255, 255, 0.1)"
                        overflow="hidden"
                      >
                          {savedCards.map((card) => (
                              <Pressable key={card.id} onPress={() => { setPaymentMethod(card.id); toggleDropdown(); }}>
                                  <XStack padding="$4" alignItems="center" gap="$3" borderBottomWidth={1} borderBottomColor="rgba(255,255,255,0.05)">
                                      <PaymentIcon type={card.type} variant="logo" width={32} height={20} />
                                      <Text fontSize={16} color="#ffffff">{card.label}</Text>
                                  </XStack>
                              </Pressable>
                          ))}

                          <Pressable onPress={() => { 
                              navigation.navigate('AddCard' as any, {
                                  onCardAdded: (newCard: any) => {
                                      setSavedCards(prev => {
                                          if (prev.some(c => c.id === newCard.id)) return prev;
                                          return [...prev, newCard];
                                      });
                                      setPaymentMethod(newCard.id);
                                  }
                              }); 
                              toggleDropdown(); 
                          }}>
                              <XStack padding="$4" alignItems="center" gap="$3">
                                  <Add size={24} color="#22c55e" />
                                  <Text fontSize={16} color="#22c55e" fontWeight="600">{t('payment.addNewCard')}</Text>
                              </XStack>
                          </Pressable>
                      </YStack>
                  )}
              </YStack>

              <Text fontSize={13} color="rgba(255, 255, 255, 0.5)" lineHeight={20} marginTop="$2">
                {t('payment.policyText')}
              </Text>
            </YStack>

          </YStack>
        </ScrollView>

        {/* Floating Button */}
        <YStack position="absolute" bottom={insets.bottom + 20} left="$4" right="$4">
            <Button 
                backgroundColor={paymentMethod ? "#22c55e" : "#333333"}
                disabled={!paymentMethod || isProcessing || !priceDetails}
                borderRadius={999} 
                height={56}
                onPress={handlePayment}
                pressStyle={{ opacity: 0.8 }}
                opacity={paymentMethod && priceDetails ? 1 : 0.6}
            >
                {isProcessing ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text color={paymentMethod && priceDetails ? "#ffffff" : "#888888"} fontWeight="700" fontSize={16}>
                        {t('payment.payNow')}
                    </Text>
                )}
            </Button>
        </YStack>

      </YStack>
    </YStack>
  );
}
