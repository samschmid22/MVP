import { BottomTabBarButtonProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import { uiTheme } from '../theme';

export const TabBarButton = ({ accessibilityState, children, onPress, onLongPress }: BottomTabBarButtonProps) => {
  const selected = accessibilityState?.selected;

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.buttonWrap} android_ripple={{ color: 'transparent' }}>
      {selected ? (
        <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.activePill}>
          {children}
        </LinearGradient>
      ) : (
        <View style={styles.inactivePill}>{children}</View>
      )}
    </Pressable>
  );
};

export const getBottomTabScreenOptions = (safeBottomInset: number): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarActiveTintColor: uiTheme.colors.white,
  tabBarInactiveTintColor: uiTheme.colors.subtext,
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
    borderRadius: uiTheme.radius.pill,
    height: 64 + Math.max(0, safeBottomInset - 6),
    paddingBottom: Math.max(8, safeBottomInset),
    paddingTop: 8,
    backgroundColor: uiTheme.colors.tabBarGlass,
    borderTopWidth: 1,
    borderTopColor: uiTheme.colors.border,
    ...uiTheme.shadows.tab,
  },
});

const styles = StyleSheet.create({
  buttonWrap: {
    flex: 1,
    marginVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    minWidth: 96,
    width: '96%',
    borderRadius: uiTheme.radius.pill,
    paddingTop: 7,
    paddingBottom: 4,
    paddingHorizontal: 14,
  },
  inactivePill: {
    minWidth: 96,
    width: '96%',
    borderRadius: uiTheme.radius.pill,
    paddingTop: 7,
    paddingBottom: 4,
    paddingHorizontal: 14,
  },
});
