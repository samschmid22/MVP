import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { PremiumScreen } from '../screens/PremiumScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WorkoutBuilderScreen } from '../screens/WorkoutBuilderScreen';
import { useAppStore } from '../storage/appStore';
import { theme } from '../theme';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.muted,
      tabBarLabelStyle: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
      tabBarItemStyle: {
        marginHorizontal: 6,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: theme.radius.pill,
      },
      tabBarActiveBackgroundColor: '#FFFFFF',
      tabBarStyle: {
        height: 76,
        paddingBottom: 10,
        paddingTop: 4,
        backgroundColor: theme.colors.tabBar,
        borderTopWidth: 1,
        borderTopColor: '#CBD5E1',
        ...theme.shadow.tabBar,
      },
    }}
  >
    <Tabs.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, focused }) => (
          <View style={{ transform: [{ scale: focused ? 1.06 : 1 }] }}>
            <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="Library"
      component={LibraryScreen}
      options={{
        tabBarLabel: 'Library',
        tabBarIcon: ({ color, focused }) => (
          <View style={{ transform: [{ scale: focused ? 1.06 : 1 }] }}>
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={26} color={color} />
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, focused }) => (
          <View style={{ transform: [{ scale: focused ? 1.06 : 1 }] }}>
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={26} color={color} />
          </View>
        ),
      }}
    />
  </Tabs.Navigator>
);

export const RootNavigator = () => {
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!onboardingCompleted ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="WorkoutBuilder"
              component={WorkoutBuilderScreen}
              options={{ title: 'Workout Builder' }}
            />
            <Stack.Screen name="Player" component={PlayerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Premium" component={PremiumScreen} options={{ title: 'Premium' }} />
            <Stack.Screen
              name="Paywall"
              component={PaywallScreen}
              options={{ title: 'Upgrade', presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
