import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { uiTheme } from '../theme';

type PageContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  sectionGap?: number;
};

export const PageContainer = ({ children, style, contentStyle, sectionGap }: PageContainerProps) => {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 1024 ? uiTheme.spacing.xxxl : width >= 640 ? uiTheme.spacing.xxl : uiTheme.spacing.lg;
  const gap = sectionGap ?? uiTheme.spacing.xl;

  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { paddingHorizontal: horizontalPadding, gap }, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: uiTheme.colors.bg,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    paddingTop: uiTheme.spacing.xl,
    paddingBottom: uiTheme.spacing.xl,
  },
});
