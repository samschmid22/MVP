import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { uiTheme } from '../theme';
import { AppText } from './AppText';

const INDICATOR_WIDTH = 60;
const INDICATOR_HEIGHT = 40;

export const getBottomTabScreenOptions = (_safeBottomInset: number): BottomTabNavigationOptions => ({
  headerShown: false,
});

export const BrandTabBar = ({ state, descriptors, navigation, insets }: BottomTabBarProps) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  const routeCount = state.routes.length;
  const itemWidth = layoutWidth > 0 ? layoutWidth / routeCount : 0;

  const targetX = useMemo(
    () => (itemWidth > 0 ? state.index * itemWidth + (itemWidth - INDICATOR_WIDTH) / 2 : 0),
    [itemWidth, state.index],
  );

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: targetX,
      useNativeDriver: true,
      damping: 20,
      mass: 0.9,
      stiffness: 210,
    }).start();
  }, [indicatorX, targetX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && nextWidth !== layoutWidth) {
      setLayoutWidth(nextWidth);
    }
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.wrapper,
        {
          height: 64 + Math.max(0, insets.bottom - 6),
          paddingBottom: Math.max(8, insets.bottom),
        },
      ]}
    >
      {itemWidth > 0 ? (
        <Animated.View style={[styles.activeIndicatorWrap, { transform: [{ translateX: indicatorX }] }]}>
          <LinearGradient
            colors={uiTheme.gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeIndicator}
          />
        </Animated.View>
      ) : null}

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? uiTheme.colors.white : uiTheme.colors.subtext;

          const labelOption = options.tabBarLabel;
          const label =
            typeof labelOption === 'string'
              ? labelOption
              : typeof options.title === 'string'
                ? options.title
                : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.item}
              android_ripple={{ color: 'transparent' }}
            >
              <View style={styles.iconLayer}>
                {options.tabBarIcon
                  ? options.tabBarIcon({
                      focused,
                      color,
                      size: 24,
                    })
                  : null}
              </View>
              <AppText variant="caption" style={[styles.label, focused && styles.labelActive]}>
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: uiTheme.radius.pill,
    borderWidth: 1,
    borderColor: uiTheme.colors.border,
    backgroundColor: uiTheme.colors.tabBarGlass,
    paddingTop: 8,
    ...uiTheme.shadows.tab,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 48,
  },
  iconLayer: {
    minHeight: 24,
    justifyContent: 'center',
  },
  label: {
    color: uiTheme.colors.subtext,
  },
  labelActive: {
    color: uiTheme.colors.white,
  },
  activeIndicatorWrap: {
    position: 'absolute',
    top: 6,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: uiTheme.radius.pill,
  },
  activeIndicator: {
    flex: 1,
    borderRadius: uiTheme.radius.pill,
  },
});
