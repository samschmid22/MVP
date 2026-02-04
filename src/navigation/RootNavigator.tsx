import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { PremiumScreen } from '../screens/PremiumScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WorkoutBuilderScreen } from '../screens/WorkoutBuilderScreen';
import { useAppStore } from '../storage/appStore';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#0f766e',
      tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8 },
    }}
  >
    <Tabs.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>H</Text> }}
    />
    <Tabs.Screen
      name="Library"
      component={LibraryScreen}
      options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>L</Text> }}
    />
    <Tabs.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ tabBarIcon: ({ color }) => <Text style={{ color }}>S</Text> }}
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
