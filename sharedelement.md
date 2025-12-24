

# Custom Shared Element Transitions in React Native (No Extra Libraries!)

## A simple, dependency-free way to create smooth thumbnail-to-fullscreen animations using Reanimated and Navigation.


So last week I spent hours banging my head against the wall trying to get a smooth transition between a thumbnail and a fullscreen view in my app. I kept thinking “there’s gotta be a cleaner way to do this!”



After a bunch of coffee and some late nights, I figured out how to build custom shared element transitions using just the core animation tools in the React Native ecosystem. No extra transition libraries needed!

## What I was trying to build

You know that slick effect where you tap an image and it smoothly expands to fill the screen? That’s what I wanted. I had tried a few approaches but kept running into edge cases they couldn’t handle.

I needed something that would:

- Work with my existing navigation setup
- Give me control over every aspect of the animation
- Not require yet another dependency


## The approach I landed on

The solution turned out to be surprisingly simple (once I figured it out 😅). Here’s what I used:

- `react-navigation` (which I was already using)
- `react-native-reanimated` for the animations
- A clever little trick with the `measure()` method

## How to build it yourself

First, you’ll need the basics installed:

```
bun add @react-navigation/native @react-navigation/native-stack
bun add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context
```

Don’t forget to update your babel config (I always forget this part):

```
module.exports = {
 presets: ['module:metro-react-native-babel-preset'],
 plugins: ['react-native-reanimated/plugin']
};
```

## Setting up the navigation

Nothing fancy here, just a standard stack with a transparent modal for our transition screen:

```
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './ListScreen';
import SharedTransitionScreen from './SharedTransitionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen
          name="SharedTransition"
          component={SharedTransitionScreen}
          options={{
            animation: 'fade',
            presentation: 'transparentModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## The main list screen

Here’s where the magic starts. The key is getting the exact position and dimensions of our thumbnail before navigating:

```
import React, { useRef } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListScreen = () => {
  const navigation = useNavigation();
  const ref = useRef(null);

  const handlePress = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      navigation.push('SharedTransition', {
        item: {
          mediaUrl: 'https://placekitten.com/300/300',
          mediaSpecs: { width, height, pageX, pageY, borderRadius: 20 },
        },
      });
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity ref={ref} onPress={handlePress}>
        <Image
          source={{ uri: 'https://placekitten.com/300/300' }}
          style={{ width: 300, height: 200, borderRadius: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ListScreen;
```

## The transition screen (where the real magic happens)

This is where Reanimated does its thing:

```
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Reanimated, {
  useSharedValue,
  withTiming,
  interpolate,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ANIMATION_CONFIG = { duration: 300 };

export default function SharedTransitionScreen() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const animated = useSharedValue(0);

  const navigation = useNavigation();
  const {
    params: {
      item: { mediaUrl, mediaSpecs },
    },
  } = useRoute();

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: interpolate(animated.value, [0, 1], [mediaSpecs.pageY - y.value, 0]),
    left: interpolate(animated.value, [0, 1], [mediaSpecs.pageX - x.value, 0]),
    width: interpolate(animated.value, [0, 1], [mediaSpecs.width, SCREEN_WIDTH]),
    height: interpolate(animated.value, [0, 1], [mediaSpecs.height, SCREEN_HEIGHT]),
    borderRadius: interpolate(animated.value, [0, 1], [mediaSpecs.borderRadius, 0]),
    transform: [{ translateX: x.value }, { translateY: y.value }],
    overflow: 'hidden',
  }));

  const handleGoBack = () => {
    animated.value = withTiming(0, ANIMATION_CONFIG, () => {
      runOnJS(navigation.goBack)();
    });
  };

  useEffect(() => {
    animated.value = withTiming(1, ANIMATION_CONFIG);
  }, []);

  return (
    <Reanimated.View style={StyleSheet.absoluteFill}>
      <Reanimated.View style={animatedStyle} onTouchEnd={handleGoBack}>
        <Image
          source={{ uri: mediaUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </Reanimated.View>
    </Reanimated.View>
  );
}
```

## What’s actually happening here

Let me break down what’s going on:

1. When you tap the thumbnail, we capture its exact position and dimensions using `measure()`
2. We pass those values to the transition screen through navigation params
3. The transition screen starts with the element at exactly the same position and size
4. Then it smoothly animates to fill the screen using Reanimated’s interpolation
5. When you tap to go back, it reverses the animation before actually navigating

What I love about this approach is how much control it gives you. You can tweak every aspect of the animation — duration, easing, even add extra effects if you want.

## Why I prefer this approach

After trying several approaches, I found this custom solution gives me some real benefits:

- No additional dependencies (I was already using Reanimated anyway)
- Complete control over the animation
- Works with any type of component, not just images
- Easier to debug when things go wrong

I’ve been using this in production for a few months now, and it’s been rock solid across both iOS and Android.

## What’s next?

I’m thinking about turning this into a reusable hook called `useSharedTransition` to make it even easier to implement. I also want to add gesture support so you can swipe to dismiss.

Let me know if you’d find either of those useful, or if you have any questions about implementing this in your own app!