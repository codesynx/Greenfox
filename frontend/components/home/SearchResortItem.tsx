import React from 'react';
import { StyleSheet, TouchableHighlight, Image } from 'react-native';
import { XStack, YStack, Text } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export interface SearchResortItemProps {
  image: string;
  name: string;
  location: string;
  rating: number;
  price?: number;
  onPress: () => void;
}

export const SearchResortItem = ({ image, name, location, rating, price, onPress }: SearchResortItemProps) => {
  return (
    <TouchableHighlight 
      onPress={onPress} 
      underlayColor="rgba(255,255,255,0.1)"
      style={styles.container}
    >
      <XStack alignItems="center" gap="$3" paddingVertical="$2">
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
        />
        
        <YStack flex={1} gap="$1">
          <Text color="white" fontSize={16} fontWeight="600" numberOfLines={1}>
            {name}
          </Text>
          
          <XStack alignItems="center" gap="$2">
            <XStack alignItems="center" gap="$1">
              <Ionicons name="location-sharp" size={12} color="#9CA3AF" />
              <Text color="#9CA3AF" fontSize={13} numberOfLines={1} maxWidth={120}>
                {location}
              </Text>
            </XStack>
            
            <XStack alignItems="center" gap="$1">
              <Ionicons name="star" size={12} color="#FDB32A" />
              <Text color="#FDB32A" fontSize={13} fontWeight="600">
                {rating}
              </Text>
            </XStack>
          </XStack>
        </YStack>

        {price ? (
          <Text color="white" fontSize={15} fontWeight="600">
            ₸{price.toLocaleString()}
          </Text>
        ) : (
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
        )}
      </XStack>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#333',
  },
});
