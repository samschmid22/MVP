import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const PrimaryButton = ({ label, onPress, disabled, icon, style, textStyle }: ButtonProps) => (
  <Pressable disabled={disabled} onPress={onPress} style={[style, disabled && styles.disabled]}>
    <LinearGradient
      colors={theme.gradients.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.primary}
    >
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={[styles.primaryText, textStyle]}>{label}</Text>
    </LinearGradient>
  </Pressable>
);

export const SecondaryButton = ({ label, onPress, disabled, icon, style, textStyle }: ButtonProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={[styles.secondary, style, disabled && styles.disabled]}
  >
    {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
    <Text style={[styles.secondaryText, textStyle]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  primary: {
    minHeight: 44,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    ...theme.shadows.soft,
  },
  secondary: {
    minHeight: 44,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFFE8',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  primaryText: {
    color: '#FFFFFF',
    ...theme.typography.button,
  },
  secondaryText: {
    color: theme.colors.text,
    ...theme.typography.button,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
