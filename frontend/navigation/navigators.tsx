import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'tamagui';
import { useTranslation } from 'react-i18next';
import OnboardingScreen from '../screens/onboarding';
import PhoneNumberScreen from '../screens/phone-number';
import OTPScreen from '../screens/otp';
import HomeScreen from '../screens/home';
import FavoritesScreen from '../screens/favorites';
import BookingsScreen from '../screens/bookings';
import ProfileScreen from '../screens/profile';
import Details from '../screens/details';
import SelectDateScreen from '../screens/select-date';
import EditProfileScreen from '../screens/edit-profile';
import HelpCenterScreen from '../screens/help-center';
import TermsScreen from '../screens/terms';
import PrivacyScreen from '../screens/privacy';
import NotificationsScreen from '../screens/notifications';
import PaymentScreen from '../screens/payment';
import AddCardScreen from '../screens/add-card';
import PromoDetailsScreen from '../screens/promo-details';
import AllPromosScreen from '../screens/all-promos';
import { PromoResponse } from '../services/promoService';
import { Home, Heart, Calendar, User } from 'iconsax-react-native';

const TabLabel = ({ titleKey, color }: { titleKey: string; color: string }) => {
  const { t } = useTranslation();
  return <Text style={{ color, fontSize: 10, fontWeight: '500' }}>{t(titleKey)}</Text>;
};

const Tab = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 1,
          borderTopColor: '#2a2a2a',
          paddingTop: 8,
          paddingBottom: 28,
          height: 88,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
            tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.home" color={color} />,
            tabBarIcon: ({ color, focused }) => (
                <Home size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{
            tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.favorites" color={color} />,
            tabBarIcon: ({ color, focused }) => (
                <Heart size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
        options={{
            tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.bookings" color={color} />,
            tabBarIcon: ({ color, focused }) => (
                <Calendar size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
            tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.profile" color={color} />,
            tabBarIcon: ({ color, focused }) => (
                <User size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const AuthStack = createStackNavigator();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
       <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
       <AuthStack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
       <AuthStack.Screen name="OTP" component={OTPScreen} />
    </AuthStack.Navigator>
  );
}

const MainStack = createStackNavigator();

export function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#0a0a0a' } }}>
       <MainStack.Screen name="MainTabs" component={TabsNavigator} />
       <MainStack.Screen name="Details" component={Details} />
       <MainStack.Screen name="SelectDate" component={SelectDateScreen} />
       <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
       <MainStack.Screen name="HelpCenter" component={HelpCenterScreen} />
       <MainStack.Screen name="Terms" component={TermsScreen} />
       <MainStack.Screen name="Privacy" component={PrivacyScreen} />
       <MainStack.Screen name="Notifications" component={NotificationsScreen} />
       <MainStack.Screen name="Payment" component={PaymentScreen} />
       <MainStack.Screen name="AddCard" component={AddCardScreen} />
       <MainStack.Screen 
         name="PromoDetails" 
         component={PromoDetailsScreen}
         options={{
            headerShown: false,
            presentation: 'transparentModal',
            cardStyle: { backgroundColor: 'transparent' },
            cardStyleInterpolator: () => ({
                cardStyle: {
                    opacity: 1
                }
            })
         }}
       />
       <MainStack.Screen name="AllPromos" component={AllPromosScreen} />
    </MainStack.Navigator>
  );
}

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      // Auth
      Onboarding: undefined;
      PhoneNumber: undefined;
      OTP: undefined;
      // Main
      MainTabs: undefined;
      Details: undefined;
      SelectDate: {
        property: {
          id: string;
          name: string;
          location: string;
          price: number;
          rating: number;
          image: string;
          type: string;
        };
      };
      EditProfile: undefined;
      HelpCenter: undefined;
      Terms: undefined;
      Privacy: undefined;
      Notifications: undefined;
      Payment: {
        property: any;
        startDate: string;
        endDate: string;
        guestCount: number;
      };
      AddCard: undefined;
      PromoDetails: {
        promo: PromoResponse;
      };
      AllPromos: undefined;
    }
  }
}

export const createAuthNavigator = () => ({ theme }: { theme: any }) => (
    <NavigationContainer theme={theme}>
        <AuthNavigator />
    </NavigationContainer>
);

export const createMainNavigator = () => ({ theme }: { theme: any }) => (
    <NavigationContainer theme={theme}>
        <MainNavigator />
    </NavigationContainer>
);
