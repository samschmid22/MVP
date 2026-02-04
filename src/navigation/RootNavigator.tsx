import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
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

const TabBarButton = ({ accessibilityState, children, onPress, onLongPress }: BottomTabBarButtonProps) => {
  const selected = accessibilityState?.selected;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabButtonWrap}>
      {selected ? (
        <LinearGradient
          colors={theme.gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activePill}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={styles.inactivePill}>{children}</View>
      )}
    </Pressable>
  );
};

const MainTabs = () => (
  <Tabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: theme.colors.muted,
      tabBarButton: (props) => <TabBarButton {...props} />,
      tabBarLabelStyle: {
        ...theme.typography.micro,
        marginBottom: 1,
        fontWeight: '600',
      },
      tabBarItemStyle: { marginHorizontal: 4, marginVertical: 6 },
      tabBarStyle: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 10,
        borderRadius: 22,
        height: 74,
        paddingBottom: 8,
        paddingTop: 6,
        backgroundColor: theme.colors.tabBar,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        ...theme.shadows.tabBar,
      },
    }}
  >
    <Tabs.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, focused }) => (
          <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
            <Ionicons name={focused ? 'home' : 'home-outline'} size={25} color={focused ? '#fff' : color} />
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
          <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={25} color={focused ? '#fff' : color} />
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
          <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={25}
              color={focused ? '#fff' : color}
            />
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

const styles = StyleSheet.create({
  tabButtonWrap: {
    flex: 1,
    marginVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    width: '100%',
    borderRadius: 14,
    paddingTop: 4,
    paddingBottom: 1,
  },
  inactivePill: {
    width: '100%',
    borderRadius: 14,
    paddingTop: 4,
    paddingBottom: 1,
  },
});
