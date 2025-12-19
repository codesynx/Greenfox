import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import { Home, Heart, Calendar, User } from 'iconsax-react-native';

const TabLabel = ({ titleKey, color }: { titleKey: string; color: string }) => {
  const { t } = useTranslation();
  return <Text style={{ color, fontSize: 10, fontWeight: '500' }}>{t(titleKey)}</Text>;
};

const Tabs = createBottomTabNavigator({
  screenOptions: {
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
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.home" color={color} />,
        tabBarIcon: ({ color, focused }) => (
          <Home size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
        ),
      },
    },
    Favorites: {
      screen: FavoritesScreen,
      options: {
        tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.favorites" color={color} />,
        tabBarIcon: ({ color, focused }) => (
          <Heart size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
        ),
      },
    },
    Bookings: {
      screen: BookingsScreen,
      options: {
        tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.bookings" color={color} />,
        tabBarIcon: ({ color, focused }) => (
          <Calendar size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
        ),
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.profile" color={color} />,
        tabBarIcon: ({ color, focused }) => (
          <User size={24} color={color} variant={focused ? 'Bold' : 'Linear'} />
        ),
      },
    },
  },
});

const Stack = createStackNavigator({
  screens: {
    Onboarding: {
      screen: OnboardingScreen,
      options: {
        headerShown: false,
      },
    },
    PhoneNumber: {
      screen: PhoneNumberScreen,
      options: {
        headerShown: false,
      },
    },
    OTP: {
      screen: OTPScreen,
      options: {
        headerShown: false,
      },
    },
    MainTabs: {
      screen: Tabs,
      options: {
        headerShown: false,
      },
    },
    Details: {
      screen: Details,
      options: {
        headerShown: false,
      },
    },
    SelectDate: {
      screen: SelectDateScreen,
      options: {
        headerShown: false,
      },
    },
    EditProfile: {
      screen: EditProfileScreen,
      options: { headerShown: false },
    },
    HelpCenter: {
      screen: HelpCenterScreen,
      options: { headerShown: false },
    },
    Terms: {
      screen: TermsScreen,
      options: { headerShown: false },
    },
    Privacy: {
      screen: PrivacyScreen,
      options: { headerShown: false },
    },
    Notifications: {
      screen: NotificationsScreen,
      options: { headerShown: false },
    },
    Payment: {
      screen: PaymentScreen,
      options: { headerShown: false },
    },
    AddCard: {
      screen: AddCardScreen,
      options: { headerShown: false },
    },
  },
});

type RootNavigatorParamList = StaticParamList<typeof Stack>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootNavigatorParamList {}
  }
}

const Navigation = createStaticNavigation(Stack);
export default Navigation;
