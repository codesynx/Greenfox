import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  FlatList,
  StatusBar,
  Image,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Text, YStack } from 'tamagui';
import { ResortPhoto } from '../services/resortService';

const { width, height } = Dimensions.get('window');

interface ImageViewerModalProps {
  visible: boolean;
  images: ResortPhoto[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageViewerModal = ({
  visible,
  images,
  initialIndex,
  onClose,
}: ImageViewerModalProps) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  // Reset index when modal opens with a new initialIndex
  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      // Timeout ensures FlatList is rendered before scrolling
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 50);
    }
  }, [visible, initialIndex]);

  if (!visible) return null;

  const currentImage = images[currentIndex];

  const onMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View 
        entering={FadeIn.duration(200)} 
        exiting={FadeOut.duration(200)}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" />
        
        {/* Counter & Close Button Header */}
        <View style={[styles.header, { top: insets.top }]}>
           {/* Counter */}
           <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {currentIndex + 1} / {images.length}
              </Text>
           </View>

           {/* Close Button */}
           <Pressable 
              onPress={onClose} 
              hitSlop={20}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color="#ffffff" />
           </Pressable>
        </View>

        {/* Image List */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          onMomentumScrollEnd={onMomentumScrollEnd}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <Pressable style={styles.imageContainer} onPress={onClose}>
              <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="contain"
              />
            </Pressable>
          )}
        />

        {/* Footer Caption */}
        {currentImage?.description ? (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.descriptionText}>
              {currentImage.description}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center', // Center the counter
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  counterContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.6)', // Optional gradient feel
  },
  descriptionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
});
