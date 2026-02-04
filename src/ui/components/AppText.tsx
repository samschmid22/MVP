import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { uiTheme } from '../theme';

type AppTextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption' | 'button';

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
    fontFamily: Platform.select({
      ios: 'Avenir Next',
      android: 'sans-serif',
      default: 'system-ui',
    }),
    includeFontPadding: false,
  },
  h1: uiTheme.typography.h1,
  h2: uiTheme.typography.h2,
  h3: uiTheme.typography.h3,
  body: uiTheme.typography.body,
  small: uiTheme.typography.small,
  caption: uiTheme.typography.caption,
  button: uiTheme.typography.button,
});
