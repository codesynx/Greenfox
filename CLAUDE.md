# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Greenfox is a booking.com-style mobile application for the Kazakhstan market, targeting local resorts and hotels (e.g., Alakol, Shymbulak, Kaspi). Built with Expo and React Native using TypeScript and stack navigation.

## Common Development Commands

### Running the App
```bash
# Start development server
bun start

# Run on iOS
bun ios

# Run on Android
bun android

# Run on Web
bun web
```

### Code Quality
```bash
# Lint and check formatting
bun lint

# Auto-fix linting and formatting issues
bun format
```

## Architecture

### Navigation
- Uses React Navigation v7 with **static navigation configuration** (not typical dynamic `NavigationContainer`)
- Navigation is defined via `createStackNavigator` in `/navigation/index.tsx`
- Exports `Navigation` component created with `createStaticNavigation(Stack)` which is used directly in `App.tsx`
- Global navigation types are declared using `StaticParamList<typeof Stack>`
- Screens are registered in the Stack screens object with route params typed via `StaticScreenProps`

### Project Structure
```
/components    - Reusable UI components (Button, BackButton, Container, etc.)
/navigation    - Navigation configuration (Stack navigator setup)
/screens       - Screen components (overview, details)
/assets        - Static assets (images, fonts, icons)
```

### TypeScript Configuration
- Uses `expo/tsconfig.base` with strict mode enabled
- Path alias configured: `@/*` maps to `src/*` (note: currently no src folder exists)
- TypeScript path mapping enabled via `experiments.tsconfigPaths` in app.json

### Styling Approach
- Currently uses React Native StyleSheet API
- User has requested migration to **Tamagui** for UI components
- Design inspiration: Spotify, Airbnb, Instagram
- Color scheme: Green primary buttons/accents, white backgrounds
- Component styling should be clean, modern, minimal

## Design Requirements

### Planned Pages
1. Onboarding (with full-screen background images from Unsplash)
2. Phone Number Entry
3. OTP Verification
4. Home (main booking interface)
5. Favorites (saved listings)
6. Bookings (user reservations)
7. Profile (user account)

### Visual Design
- Primary color: Green (#00FF00 or similar green tones for buttons/CTAs)
- Background: White/light
- Full-screen background images (no borders/containers) on onboarding
- Modern, clean UI inspired by consumer apps like Spotify, Airbnb, Instagram

## Key Dependencies
- Expo SDK 54
- React Navigation v7 (Stack Navigator with static configuration)
- React Native 0.81.4
- React 19.1.0
- TypeScript 5.9.2
- React Native Reanimated & Gesture Handler for animations/gestures

## Development Notes

### Navigation Pattern
When adding new screens:
1. Create screen component in `/screens`
2. Add screen to Stack configuration in `/navigation/index.tsx`
3. Update `RootNavigatorParamList` type with route params if needed
4. Use `StaticScreenProps` for typing screen props with route params

### Component Development
- Prefer functional components with TypeScript
- Use `forwardRef` for components that need ref forwarding
- Keep reusable UI components in `/components`
- Screen-specific components can live in `/screens`
