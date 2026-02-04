import { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../theme';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accentColor?: string;
  accentGradient?: readonly [string, string, string];
  accentPosition?: 'left' | 'top';
};

export const Card = ({
  children,
  style,
  accentColor,
  accentGradient,
  accentPosition = 'top',
}: CardProps) => (
  <View style={[styles.card, style]}>
    {accentGradient ? (
      <LinearGradient
        colors={accentGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.accent, accentPosition === 'left' ? styles.accentLeft : styles.accentTop]}
      />
    ) : accentColor ? (
      <View
        style={[
          styles.accent,
          accentPosition === 'left' ? styles.accentLeft : styles.accentTop,
          { backgroundColor: accentColor },
        ]}
      />
    ) : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.soft,
  },
  accent: {
    position: 'absolute',
  },
  accentLeft: {
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  accentTop: {
    left: 0,
    right: 0,
    top: 0,
    height: 4,
  },
});
