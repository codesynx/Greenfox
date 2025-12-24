import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { MainNavigator, AuthNavigator } from './navigators';

interface AppContentProps {
  theme: any;
}

export const AppContent = ({ theme }: AppContentProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <LottieView
          source={require('../assets/loading-travel.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  // Render appropriate navigator based on auth state
  return (
    <NavigationContainer theme={theme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
