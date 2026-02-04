import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { PremiumScreen } from '../screens/PremiumScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WorkoutBuilderScreen } from '../screens/WorkoutBuilderScreen';
import { useAppStore } from '../storage/appStore';
import { BrandTabBar, getBottomTabScreenOptions } from '../ui/components';
import { uiTheme } from '../ui/theme';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs.Navigator
      tabBar={(props) => <BrandTabBar {...props} />}
      screenOptions={getBottomTabScreenOptions(insets.bottom)}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ scale: focused ? 1.04 : 1 }] }}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={focused ? uiTheme.colors.white : color}
              />
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
            <View style={{ transform: [{ scale: focused ? 1.04 : 1 }] }}>
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={24}
                color={focused ? uiTheme.colors.white : color}
              />
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
            <View style={{ transform: [{ scale: focused ? 1.04 : 1 }] }}>
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={24}
                color={focused ? uiTheme.colors.white : color}
              />
            </View>
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

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
