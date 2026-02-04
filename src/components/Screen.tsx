import { LinearGradient } from 'expo-linear-gradient';
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
    <View pointerEvents="none" style={styles.gradientWrap}>
      <LinearGradient
        colors={theme.gradients.wash}
        locations={[0, 0.58, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        style={styles.gradient}
      />
    </View>
    <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 210,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
  },
});
