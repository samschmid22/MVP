import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

type ScreenProps = {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export const Screen = ({ children, padded = true, style, contentStyle }: ScreenProps) => (
  <SafeAreaView style={[styles.safeArea, style]} edges={['top']}>
    <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
  },
});
