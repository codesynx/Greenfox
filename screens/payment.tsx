import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { YStack, XStack, Text, Button, Image, Separator } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowDown2, Add } from 'iconsax-react-native';
import { PaymentIcon } from 'react-native-payment-card-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function PaymentScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  // Get data from params
  const { property, startDate, endDate, guestCount } = (route.params as any) || {};

  // Helper to format dates
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const calculateNights = (start: string | Date, end: string | Date) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays || 1;
  };

  const nights = calculateNights(startDate, endDate);
  const pricePerNight = property?.price || 0;
  const roomFee = pricePerNight * nights;
  const discount = 0; // Mock discount for now
  const taxRate = 0.10;
  const tax = roomFee * taxRate;
  const total = roomFee - discount + tax;

  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                        ₸{property.price.toLocaleString()}
                    </Text>
                </YStack>
            </XStack>

            {/* Detail Section */}
            <YStack gap="$4">
              <Text fontSize={18} fontWeight="600" color="#ffffff">{t('payment.priceDetails')}</Text>
              
              <YStack gap="$3">
                <XStack justifyContent="space-between">
                    <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('payment.roomFee')}</Text>
                    <Text fontSize={16} fontWeight="600" color="#ffffff">₸{roomFee.toLocaleString()}</Text>
                </XStack>
                
                {discount > 0 && (
                    <XStack justifyContent="space-between">
                        <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('payment.discount')}</Text>
                        <Text fontSize={16} fontWeight="600" color="#ef4444">- ₸{discount.toLocaleString()}</Text>
                    </XStack>
                )}

                <XStack justifyContent="space-between">
                    <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('payment.taxes')}</Text>
                    <Text fontSize={16} fontWeight="600" color="#ffffff">₸{tax.toLocaleString()}</Text>
                </XStack>
                
                <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
                    <Text fontSize={20} fontWeight="600" color="#ffffff">{t('payment.total')}</Text>
                    <Text fontSize={24} fontWeight="700" color="#ffffff">₸{total.toLocaleString()}</Text>
                </XStack>
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
                backgroundColor="#22c55e"
                borderRadius={999} 
                height={56}
                onPress={() => {
                    // Handle payment confirmation
                }}
                pressStyle={{ opacity: 0.8 }}
            >
                <Text color="#ffffff" fontWeight="700" fontSize={16}>{t('payment.payNow')}</Text>
            </Button>
        </YStack>

      </YStack>
    </YStack>
  );
}
