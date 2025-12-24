import { useState, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../i18n'; // Import i18n config

import { slides } from '../components/onboarding/data';
import { OnboardingSlideItem } from '../components/onboarding/OnboardingSlideItem';
import { LanguageSelector } from '../components/onboarding/LanguageSelector';
import { OnboardingFooter } from '../components/onboarding/OnboardingFooter';
import { OnboardingSlide } from '../components/onboarding/types';

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const { i18n } = useTranslation();

  const changeLanguage = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    await AsyncStorage.setItem('language', langCode);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      navigation.navigate('PhoneNumber' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('PhoneNumber' as never);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <OnboardingSlideItem item={item} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <LanguageSelector 
        currentLanguage={i18n.language} 
        onLanguageChange={changeLanguage} 
      />

      <OnboardingFooter 
        currentIndex={currentIndex}
        totalSlides={slides.length}
        onSkip={handleSkip}
        onNext={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
