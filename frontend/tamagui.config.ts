import { config } from '@tamagui/config/v3';
import { createTamagui, createFont } from 'tamagui';

const manropeFont = createFont({
  family: 'Manrope',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 28,
    7: 32,
    8: 40,
    9: 48,
    10: 64,
    11: 80,
    12: 96,
  },
  lineHeight: {
    1: 17,
    2: 22,
    3: 25,
    4: 30,
    5: 35,
    6: 40,
    7: 45,
    8: 55,
    9: 65,
    10: 80,
    11: 100,
    12: 120,
  },
  weight: {
    1: '200',
    2: '300',
    3: '400',
    4: '500',
    5: '600',
    6: '700',
    7: '800',
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: -0.5,
    6: -0.75,
    7: -1,
    8: -1.5,
    9: -2,
  },
  // Face keys must be string to match fontWeight
  face: {
    200: { normal: 'ManropeExtraLight' },
    300: { normal: 'ManropeLight' },
    400: { normal: 'ManropeRegular' },
    500: { normal: 'ManropeMedium' },
    600: { normal: 'ManropeSemiBold' },
    700: { normal: 'ManropeBold' },
    800: { normal: 'ManropeExtraBold' },
  },
});

const greenfoxConfig = createTamagui({
  ...config,
  fonts: {
    heading: manropeFont,
    body: manropeFont,
  },
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      // Green primary color for Greenfox
      green1: '#f0fdf4',
      green2: '#dcfce7',
      green3: '#bbf7d0',
      green4: '#86efac',
      green5: '#4ade80',
      green6: '#22c55e',
      green7: '#16a34a',
      green8: '#15803d',
      green9: '#166534',
      green10: '#14532d',

      // Override primary colors to green
      color: '#166534',
      colorHover: '#15803d',
      colorPress: '#14532d',
      colorFocus: '#16a34a',

      background: '#ffffff',
      backgroundHover: '#f9fafb',
      backgroundPress: '#f3f4f6',
      backgroundFocus: '#f9fafb',

      borderColor: '#e5e7eb',
      borderColorHover: '#d1d5db',
      borderColorFocus: '#22c55e',
      borderColorPress: '#16a34a',
    },
    dark: {
      ...config.themes.dark,
      // Green primary color for Greenfox (same as light)
      green1: '#14532d',
      green2: '#166534',
      green3: '#15803d',
      green4: '#16a34a',
      green5: '#22c55e',
      green6: '#4ade80',
      green7: '#86efac',
      green8: '#bbf7d0',
      green9: '#dcfce7',
      green10: '#f0fdf4',

      // Dark mode immersive colors
      color: '#ffffff',
      colorHover: '#f3f4f6',
      colorPress: '#e5e7eb',
      colorFocus: '#22c55e',

      // Dark backgrounds for immersive design
      background: '#0a0a0a',
      backgroundHover: '#1a1a1a',
      backgroundPress: '#2a2a2a',
      backgroundFocus: '#1a1a1a',

      // Subtle borders for dark mode
      borderColor: '#2a2a2a',
      borderColorHover: '#3a3a3a',
      borderColorFocus: '#22c55e',
      borderColorPress: '#16a34a',
    },
  },
});

type Conf = typeof greenfoxConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default greenfoxConfig;
