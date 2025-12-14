import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import ru from './locales/ru.json';
import kk from './locales/kk.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  kk: { translation: kk },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
      savedLanguage = 'ru'; // Default to Russian
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'ru', // Default fallback is Russian
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
