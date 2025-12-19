import React, { useState, useRef } from 'react';
import { StyleSheet, Pressable, Dimensions, ScrollView, View, Animated } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, User, ArrowRight, Minus, Add } from 'iconsax-react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function SelectDate() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  // Generate translated weekday names (Mon, Tue...) based on current locale
  // We pick a known Monday (e.g., Jan 1 2024 was Monday)
  // Wait, Jan 1 2024 was Monday. 
  // Let's use a fixed week reference.
  const DAYS = Array.from({ length: 7 }, (_, i) => {
    // Jan 1, 2024 is a Monday
    const date = new Date(2024, 0, 1 + i); 
    return date.toLocaleDateString(i18n.language, { weekday: 'short' });
  });
  
  // Get property from params (mock if undefined for safety)
  const property = (route.params as any)?.property || { price: 150 };

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [activeInput, setActiveInput] = useState<'checkIn' | 'checkOut' | null>(null);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  // State for Favorites and Toast
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
      showToastNotification(t('home.savedToast'));
    }
  };

  const showToastNotification = (message: string) => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const startOffset = (firstDayOfMonth + 6) % 7; // Convert to 0 = Mon

  const CURRENT_MONTH_DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isSelected = (day: number) => {
    if (!startDate) return false;
    const current = new Date(year, month, day);
    
    if (isSameDay(current, startDate)) return 'start';
    if (isSameDay(current, endDate)) return 'end';
    
    if (endDate && startDate) {
      if (current > startDate && current < endDate) return 'middle';
    }
    return false;
  };

  const handleDayPress = (day: number) => {
    const selectedDate = new Date(year, month, day);

    if (activeInput === 'checkIn') {
      setStartDate(selectedDate);
      if (endDate && selectedDate > endDate) setEndDate(null);
      setActiveInput('checkOut');
    } else if (activeInput === 'checkOut') {
      if (startDate && selectedDate < startDate) {
        setStartDate(selectedDate);
        setEndDate(null);
      } else {
        setEndDate(selectedDate);
        setActiveInput(null);
      }
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(selectedDate);
        setEndDate(null);
        setActiveInput('checkOut');
      } else if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        setStartDate(selectedDate);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t('selectDate.select');
    return date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
  };

  return (
    <YStack flex={1} backgroundColor="#0a0a0a">
      <YStack paddingTop={insets.top} flex={1}>
        {/* Header */}
        <XStack paddingHorizontal="$4" paddingVertical="$4" alignItems="center" gap="$4">
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={28} color="#ffffff" />
          </Pressable>
          <Text fontSize={20} fontWeight="700" color="#ffffff">{t('selectDate.title')}</Text>
        </XStack>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <YStack paddingHorizontal="$4" gap="$4">
            {/* Input Section - Row 1 */}
            <XStack gap="$3">
              <Button
                flex={1}
                height={50}
                backgroundColor={activeInput === 'checkIn' ? "rgba(34, 197, 94, 0.1)" : "rgba(255, 255, 255, 0.05)"}
                borderRadius={25}
                borderWidth={1}
                borderColor={activeInput === 'checkIn' ? "#22c55e" : "rgba(255, 255, 255, 0.1)"}
                pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                icon={<Calendar size={20} color={activeInput === 'checkIn' ? "#22c55e" : "#22c55e"} variant="Bold" />}
                justifyContent="flex-start"
                paddingLeft="$4"
                onPress={() => setActiveInput('checkIn')}
              >
                <YStack alignItems="flex-start">
                  <Text fontSize={10} color="rgba(255, 255, 255, 0.5)">{t('selectDate.checkIn')}</Text>
                  <Text fontSize={14} color="#ffffff" fontWeight="600">{formatDate(startDate)}</Text>
                </YStack>
              </Button>

              <Button
                flex={1}
                height={50}
                backgroundColor={activeInput === 'checkOut' ? "rgba(34, 197, 94, 0.1)" : "rgba(255, 255, 255, 0.05)"}
                borderRadius={25}
                borderWidth={1}
                borderColor={activeInput === 'checkOut' ? "#22c55e" : "rgba(255, 255, 255, 0.1)"}
                pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                icon={<Calendar size={20} color={activeInput === 'checkOut' ? "#22c55e" : "#22c55e"} variant="Bold" />}
                justifyContent="flex-start"
                paddingLeft="$4"
                onPress={() => setActiveInput('checkOut')}
              >
                <YStack alignItems="flex-start">
                  <Text fontSize={10} color="rgba(255, 255, 255, 0.5)">{t('selectDate.checkOut')}</Text>
                  <Text fontSize={14} color="#ffffff" fontWeight="600">{formatDate(endDate)}</Text>
                </YStack>
              </Button>
            </XStack>

            {/* Input Section - Row 2 */}
            <YStack>
                <Button
                width="100%"
                height={50}
                backgroundColor="rgba(255, 255, 255, 0.05)"
                borderRadius={25}
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.1)"
                pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                icon={<User size={20} color="#22c55e" variant="Bold" />}
                justifyContent="flex-start"
                paddingLeft="$4"
                onPress={() => setShowGuestPicker(!showGuestPicker)}
                >
                <XStack flex={1} justifyContent="space-between" alignItems="center">
                    <YStack alignItems="flex-start">
                    <Text fontSize={10} color="rgba(255, 255, 255, 0.5)">{t('selectDate.guests')}</Text>
                    <Text fontSize={14} color="#ffffff" fontWeight="600">{guestCount} {t('selectDate.guestsCount')}</Text>
                    </YStack>
                </XStack>
                </Button>
                
                {/* Guest Picker Modal/Expansion */}
                {showGuestPicker && (
                    <YStack 
                        marginTop="$2" 
                        padding="$4" 
                        backgroundColor="rgba(255,255,255,0.05)" 
                        borderRadius={16} 
                        borderWidth={1} 
                        borderColor="rgba(255,255,255,0.1)"
                        alignItems="center"
                    >
                        <XStack alignItems="center" gap="$4">
                            <Pressable 
                                onPress={() => setGuestCount(Math.max(1, guestCount - 1))}
                                style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}
                            >
                                <Minus size={20} color="white" />
                            </Pressable>
                            <Text fontSize={20} fontWeight="600" color="white" minWidth={40} textAlign="center">{guestCount}</Text>
                            <Pressable 
                                onPress={() => setGuestCount(guestCount + 1)}
                                style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}
                            >
                                <Add size={20} color="white" />
                            </Pressable>
                        </XStack>
                    </YStack>
                )}
            </YStack>

            {/* Calendar Component */}
            <YStack
              backgroundColor="rgba(255, 255, 255, 0.05)"
              borderRadius={24}
              padding="$4"
              marginTop="$2"
            >
              {/* Month Navigation */}
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                <Pressable onPress={handlePrevMonth} hitSlop={10}>
                  <ArrowLeft size={20} color="#ffffff" />
                </Pressable>
                <Text fontSize={16} fontWeight="700" color="#ffffff">
                  {currentMonth.toLocaleString(i18n.language, { month: 'long', year: 'numeric' })}
                </Text>
                <Pressable onPress={handleNextMonth} hitSlop={10}>
                  <ArrowRight size={20} color="#ffffff" />
                </Pressable>
              </XStack>

              {/* Days Header */}
              <XStack marginBottom="$2" justifyContent="space-between">
                {DAYS.map((day) => (
                  <Text key={day} width="14.28%" textAlign="center" fontSize={12} color="rgba(255, 255, 255, 0.4)">
                    {day}
                  </Text>
                ))}
              </XStack>

              {/* Date Grid */}
              <XStack flexWrap="wrap">
                {/* Empty slots for offset */}
                {Array.from({ length: startOffset }).map((_, i) => (
                   <View key={`empty-${i}`} style={{ width: '14.28%', height: 48 }} />
                ))}
                
                {CURRENT_MONTH_DAYS.map((day) => {
                  const status = isSelected(day);
                  const isStart = status === 'start';
                  const isEnd = status === 'end';
                  const isMiddle = status === 'middle';

                  // Calculate grid position
                  const colIndex = (startOffset + day - 1) % 7;
                  const isRowStart = colIndex === 0;
                  const isRowEnd = colIndex === 6;

                  // Determine if we need to show the range background
                  const showRange = isMiddle || (isStart && endDate) || (isEnd && startDate);

                  return (
                    <Pressable
                      key={day}
                      onPress={() => handleDayPress(day)}
                      style={{
                        width: '14.28%',
                        height: 48,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      {/* Range Strip (Behind Circles) */}
                      {showRange && (
                        <View style={{
                            position: 'absolute',
                            top: 4,
                            bottom: 4,
                            left: isStart ? '50%' : 0,
                            right: isEnd ? '50%' : 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            zIndex: 1,
                            // Round edges if at start/end of row
                            borderTopLeftRadius: isRowStart ? 20 : 0,
                            borderBottomLeftRadius: isRowStart ? 20 : 0,
                            borderTopRightRadius: isRowEnd ? 20 : 0,
                            borderBottomRightRadius: isRowEnd ? 20 : 0,
                        }} />
                      )}

                      {/* Start/End Circles */}
                      {(isStart || isEnd) && (
                        <View style={{
                            position: 'absolute',
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#ffffff',
                            zIndex: 2,
                        }} />
                      )}

                      <View style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3,
                      }}>
                        <Text
                            fontSize={14}
                            fontWeight={status ? "700" : "400"}
                            color={(isStart || isEnd) ? '#000000' : '#ffffff'}
                        >
                          {day}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </XStack>
            </YStack>

          </YStack>
        </ScrollView>

        {/* Fixed Footer */}
        <BlurView intensity={80} tint="dark" style={styles.footer}>
          <YStack padding="$4" paddingBottom={insets.bottom + 16} gap="$4">
            {/* Price Info Row */}
            <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={16} color="rgba(255, 255, 255, 0.6)">{t('selectDate.price')}</Text>
                <Text fontSize={20} fontWeight="700" color="#22c55e">
                    ₸{property.price.toLocaleString()} <Text fontSize={14} color="rgba(255,255,255,0.6)">{t('selectDate.night')}</Text>
                </Text>
            </XStack>

            {/* Button Row */}
            <XStack gap="$3">
              <Pressable
                onPress={toggleFavorite}
                style={[
                  styles.heartButton,
                  isFavorite && styles.heartButtonActive
                ]}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isFavorite ? "#22c55e" : "#ffffff"}
                />
              </Pressable>
              <Button
                flex={1}
                backgroundColor="#22c55e"
                color="white"
                height={56}
                borderRadius={999}
                fontSize={16}
                fontWeight="600"
                pressStyle={{ backgroundColor: '#16a34a' }}
                onPress={() => {
                    if (startDate && endDate) {
                        navigation.navigate('Payment' as any, {
                            property,
                            startDate: startDate.toISOString(),
                            endDate: endDate.toISOString(),
                            guestCount
                        });
                    } else {
                        // Show toast or alert that dates must be selected
                        showToastNotification(t('selectDate.selectDatesWarning') || "Please select check-in and check-out dates");
                    }
                }}
              >
                {t('selectDate.confirm')}
              </Button>
            </XStack>
          </YStack>
        </BlurView>
      </YStack>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity, top: insets.top + 60 }]}>
          <BlurView intensity={40} tint="dark" style={styles.toastBlur}>
            <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingVertical="$3">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text color="white" fontWeight="600">{t('home.savedToast')}</Text>
            </XStack>
          </BlurView>
        </Animated.View>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  heartButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heartButtonActive: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
  }
});
