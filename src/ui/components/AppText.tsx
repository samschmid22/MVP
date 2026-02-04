import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { uiTheme } from '../theme';

type AppTextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

type AppTextProps = {
  children: ReactNode;
  variant?: AppTextVariant;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export const AppText = ({ children, variant = 'body', style, numberOfLines }: AppTextProps) => (
  <Text numberOfLines={numberOfLines} style={[styles.base, styles[variant], style]}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  base: {
    color: uiTheme.colors.text,
  },
  h1: uiTheme.typography.h1,
  h2: uiTheme.typography.h2,
  h3: uiTheme.typography.h3,
  body: uiTheme.typography.body,
  caption: uiTheme.typography.caption,
});
