import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { uiTheme } from '../theme';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: boolean;
};

export const Card = ({ children, style, accent = false }: CardProps) => (
  <View style={[styles.card, style]}>
    {accent ? (
      <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.accent} />
    ) : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: uiTheme.colors.surface,
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    padding: uiTheme.spacing.md,
    overflow: 'hidden',
    ...uiTheme.shadows.soft,
  },
  accent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
  },
});
