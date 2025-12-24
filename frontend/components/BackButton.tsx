import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'tamagui';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <Ionicons name="chevron-back" size={24} color="#22c55e" />
      <Text color="#22c55e" fontSize={16} fontWeight="600" marginLeft={4}>Back</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 8,
  },
});
