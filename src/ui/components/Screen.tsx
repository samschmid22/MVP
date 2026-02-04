import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uiTheme } from '../theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padded?: boolean;
};

export const Screen = ({ children, style, contentStyle, padded = true }: ScreenProps) => (
  <SafeAreaView edges={['top']} style={[styles.root, style]}>
    <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: uiTheme.colors.bg,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: uiTheme.spacing.xxl,
  },
});
