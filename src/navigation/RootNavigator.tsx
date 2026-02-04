import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
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
import { uiTheme } from '../ui/theme';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const TabBarButton = ({ accessibilityState, children, onPress, onLongPress }: BottomTabBarButtonProps) => {
  const selected = accessibilityState?.selected;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButtonWrap}
      android_ripple={{ color: 'transparent' }}
    >
      {selected ? (
        <LinearGradient
          colors={uiTheme.gradients.brand}
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

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: uiTheme.colors.white,
        tabBarInactiveTintColor: uiTheme.colors.muted,
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarLabelStyle: {
          ...uiTheme.typography.caption,
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarItemStyle: { marginHorizontal: 4, marginVertical: 4 },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          borderRadius: 999,
          height: 64 + Math.max(0, insets.bottom - 6),
          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 8,
          backgroundColor: uiTheme.colors.tabBarGlass,
          borderTopWidth: 1,
          borderTopColor: uiTheme.colors.stroke,
          ...uiTheme.shadows.tab,
        },
      }}
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

const styles = StyleSheet.create({
  tabButtonWrap: {
    flex: 1,
    marginVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    minWidth: 94,
    width: '96%',
    borderRadius: 999,
    paddingTop: 7,
    paddingBottom: 4,
    paddingHorizontal: 14,
  },
  inactivePill: {
    minWidth: 94,
    width: '96%',
    borderRadius: 999,
    paddingTop: 7,
    paddingBottom: 4,
    paddingHorizontal: 14,
  },
});
