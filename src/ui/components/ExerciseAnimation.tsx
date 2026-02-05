import { memo, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { animationSources } from '../../animations';
import { AnimationKey } from '../../config/exerciseAnimationMap';
import { uiTheme } from '../theme';

type ExerciseAnimationProps = {
  animationKey: AnimationKey;
  size?: 'card' | 'player';
  loop?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const sizeMap = {
  card: 88,
  player: 220,
};

export const ExerciseAnimation = memo(
  ({ animationKey, size = 'card', loop = true, style }: ExerciseAnimationProps) => {
    const dimension = sizeMap[size];
    const padding = size === 'player' ? 12 : 8;

    const containerStyle = useMemo(
      () => [
        styles.container,
        {
          width: dimension + padding * 2,
          height: dimension + padding * 2,
          padding,
        },
      ],
      [dimension, padding],
    );

    const source = animationSources[animationKey];

    return (
      <View style={[containerStyle, style]}>
        {source ? (
          <LottieView source={source} autoPlay loop={loop} style={{ width: dimension, height: dimension }} />
        ) : (
          <View style={[styles.fallback, { width: dimension, height: dimension }]}> 
            <View style={styles.fallbackCircle} />
            <Ionicons name="body-outline" size={dimension * 0.45} color={uiTheme.colors.text} />
          </View>
        )}
      </View>
    );
  },
);

ExerciseAnimation.displayName = 'ExerciseAnimation';

const styles = StyleSheet.create({
  container: {
    borderRadius: uiTheme.radius.lg,
    backgroundColor: uiTheme.colors.surface,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackCircle: {
    position: 'absolute',
    width: '78%',
    height: '78%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: uiTheme.colors.text,
    opacity: 0.6,
  },
});
