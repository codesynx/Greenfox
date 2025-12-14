import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import OnboardingScreen from '../screens/onboarding';
import PhoneNumberScreen from '../screens/phone-number';
import OTPScreen from '../screens/otp';
import HomeScreen from '../screens/home';
import FavoritesScreen from '../screens/favorites';
import BookingsScreen from '../screens/bookings';
import ProfileScreen from '../screens/profile';
import Details from '../screens/details';
import EditProfileScreen from '../screens/edit-profile';
import HelpCenterScreen from '../screens/help-center';
import TermsScreen from '../screens/terms';
import PrivacyScreen from '../screens/privacy';
import NotificationsScreen from '../screens/notifications';
import { Ionicons } from '@expo/vector-icons';

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
          <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
        ),
      },
    },
    Favorites: {
      screen: FavoritesScreen,
      options: {
        tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.favorites" color={color} />,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
        ),
      },
    },
    Bookings: {
      screen: BookingsScreen,
      options: {
        tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.bookings" color={color} />,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} />
        ),
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        tabBarLabel: ({ color }) => <TabLabel titleKey="tabs.profile" color={color} />,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
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
