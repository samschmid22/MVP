import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './AppText';
import { uiTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const AppButton = ({
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
      <View style={styles.secondary}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <AppText variant="button" style={styles.secondaryText}>
          {label}
        </AppText>
      </View>
    ) : null}
    {variant === 'outline' ? (
      <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.outlineBorder}>
        <View style={styles.outlineInner}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <AppText variant="button" style={styles.outlineText}>
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

export const Button = AppButton;

const shared = {
  minHeight: 48,
  borderRadius: uiTheme.radius.pill,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexDirection: 'row' as const,
  paddingHorizontal: uiTheme.spacing.xl,
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
  secondary: {
    ...shared,
    backgroundColor: uiTheme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
  },
  secondaryText: {
    color: uiTheme.colors.text,
  },
  outlineBorder: {
    ...shared,
    padding: 1,
  },
  outlineInner: {
    minHeight: 46,
    borderRadius: uiTheme.radius.pill,
    backgroundColor: 'rgba(243, 238, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: uiTheme.spacing.xl,
    gap: uiTheme.spacing.xs,
  },
  outlineText: {
    color: uiTheme.colors.brandPurple,
  },
  ghost: {
    minHeight: 40,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: uiTheme.spacing.xs,
    paddingHorizontal: uiTheme.spacing.sm,
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: uiTheme.colors.brandPurple,
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
