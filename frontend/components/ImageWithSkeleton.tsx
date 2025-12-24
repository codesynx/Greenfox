import { useState, useEffect, useRef } from 'react';
import { Image, ImageProps, View, StyleSheet, Animated } from 'react-native';

interface ImageWithSkeletonProps extends ImageProps {
  skeletonColor?: string;
}

export const ImageWithSkeleton = ({ 
  style, 
  skeletonColor = '#2a2a2a', 
  ...props 
}: ImageWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0.3)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    
    if (!isLoaded) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isLoaded]);

  const handleLoadEnd = () => {
    setIsLoaded(true);
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, style]}>
      {!isLoaded && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: skeletonColor,
              opacity: opacity,
            },
          ]}
        />
      )}
      <Animated.Image
        {...props}
        style={[style, { opacity: imageOpacity }]}
        onLoadEnd={handleLoadEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#1a1a1a', // Fallback background
  },
});
