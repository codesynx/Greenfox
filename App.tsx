import { DarkTheme } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './i18n';

import "react-native-gesture-handler";

import Navigation from "./navigation";

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
  // Always use dark mode for immersive design
  const theme = ImmersiveDarkTheme;

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme="dark">
        <Navigation theme={theme} />
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
