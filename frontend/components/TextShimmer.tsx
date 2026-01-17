import React from 'react';
import { Text, StyleSheet, View, TextProps, LayoutChangeEvent } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

interface TextShimmerProps extends TextProps {
  children: string;
  duration?: number;
}

export function TextShimmer({ 
  children, 
  duration = 2000,
  style,
  ...props 
}: TextShimmerProps) {
  const [layout, setLayout] = React.useState<{ width: number; height: number } | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  // If we don't have layout yet, render invisible text to measure it
  if (!layout) {
    return (
      <Text style={[style, { opacity: 0 }]} onLayout={onLayout} {...props}>
        {children}
      </Text>
    );
  }

  return (
    <MaskedView
      style={{ width: layout.width, height: layout.height }}
      maskElement={
        <Text style={style} {...props}>
          {children}
        </Text>
      }
    >
      {/* Background layer (base text color) */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#888' }]} />

      {/* Shimmer layer */}
      <MotiView
        from={{
          translateX: -layout.width,
        }}
        animate={{
          translateX: layout.width,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: duration,
          repeatReverse: false,
        }}
        style={[StyleSheet.absoluteFill, { width: layout.width * 2.5 }]} // Wider to ensure smooth pass
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.8)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </MotiView>
    </MaskedView>
  );
}

const styles = StyleSheet.create({});
