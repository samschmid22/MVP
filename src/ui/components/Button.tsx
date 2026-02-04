import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './AppText';
import { uiTheme } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const Button = ({
  label,
  onPress,
  icon,
  variant = 'primary',
  style,
  disabled = false,
}: ButtonProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [style, pressed && styles.pressed, disabled && styles.disabled]}
  >
    {variant === 'primary' ? (
      <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primary}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <AppText variant="button" style={styles.primaryText}>
          {label}
        </AppText>
      </LinearGradient>
    ) : null}
    {variant === 'secondary' ? (
      <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.secondaryBorder}>
        <View style={styles.secondaryInner}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <AppText variant="button" style={styles.secondaryText}>
            {label}
          </AppText>
        </View>
      </LinearGradient>
    ) : null}
    {variant === 'ghost' ? (
      <View style={styles.ghost}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <AppText variant="button" style={styles.ghostText}>
          {label}
        </AppText>
      </View>
    ) : null}
  </Pressable>
);

const shared = {
  minHeight: 46,
  borderRadius: uiTheme.radius.pill,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
  paddingHorizontal: uiTheme.spacing.lg,
  gap: uiTheme.spacing.xs,
};

const styles = StyleSheet.create({
  primary: {
    ...shared,
    ...uiTheme.shadows.soft,
  },
  primaryText: {
    color: uiTheme.colors.white,
  },
  secondaryBorder: {
    ...shared,
    padding: 1.5,
  },
  secondaryInner: {
    flex: 1,
    minHeight: 43,
    borderRadius: uiTheme.radius.pill,
    backgroundColor: uiTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: uiTheme.spacing.xs,
    paddingHorizontal: uiTheme.spacing.lg,
  },
  secondaryText: {
    color: uiTheme.colors.brandPurple,
  },
  ghost: {
    ...shared,
    minHeight: 40,
    paddingHorizontal: uiTheme.spacing.md,
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: uiTheme.colors.muted,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
