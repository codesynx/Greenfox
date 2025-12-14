import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

const greenfoxConfig = createTamagui({
  ...config,
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
