import { DarkTheme } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import './i18n';

import "react-native-gesture-handler";

import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AppContent } from './navigation/AppContent';

// Custom dark theme for immersive design
const ImmersiveDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#22c55e',
    background: '#0a0a0a',
    card: '#1a1a1a',
    text: '#ffffff',
    border: '#2a2a2a',
    notification: '#22c55e',
  },
};

export default function App() {
  const [loaded] = useFonts({
    ManropeBold: require('./assets/Manrope/OTF/Manrope-Bold.otf'),
    ManropeExtraBold: require('./assets/Manrope/OTF/Manrope-ExtraBold.otf'),
    ManropeExtraLight: require('./assets/Manrope/OTF/Manrope-ExtraLight.otf'),
    ManropeLight: require('./assets/Manrope/OTF/Manrope-Light.otf'),
    ManropeMedium: require('./assets/Manrope/OTF/Manrope-Medium.otf'),
    ManropeRegular: require('./assets/Manrope/OTF/Manrope-Regular.otf'),
    ManropeSemiBold: require('./assets/Manrope/OTF/Manrope-SemiBold.otf'),
  });

  // Always use dark mode for immersive design
  const theme = ImmersiveDarkTheme;

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme="dark">
        <AuthProvider>
          <FavoritesProvider>
            <AppContent theme={theme} />
          </FavoritesProvider>
        </AuthProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
