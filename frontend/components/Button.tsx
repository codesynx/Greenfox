import { forwardRef } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Text } from 'tamagui';

type ButtonProps = {
  title?: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity ref={ref} {...touchableProps} style={[styles.button, touchableProps.style]}>
      <Text color="#FFFFFF" fontSize={16} fontWeight="600" textAlign="center">{title}</Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 999, // Capsule/Pill shape
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});
