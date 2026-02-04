import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { uiTheme } from '../theme';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  // Deprecated: retained for compatibility while screens migrate to neutral cards.
  accent?: boolean;
};

export const Card = ({ children, style }: CardProps) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: uiTheme.colors.card,
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    padding: uiTheme.spacing.lg,
    overflow: 'hidden',
    ...uiTheme.shadows.soft,
  },
});
