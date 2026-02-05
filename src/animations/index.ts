import type { AnimationObject } from 'lottie-react-native';
import monoLoop from './mono-loop.json';
import { AnimationKey } from '../config/exerciseAnimationMap';

export const animationSources: Record<AnimationKey, AnimationObject> = {
  mobility: monoLoop,
  squat: monoLoop,
  hinge: monoLoop,
  lunge: monoLoop,
  push: monoLoop,
  pull: monoLoop,
  plank: monoLoop,
  twist: monoLoop,
  neck: monoLoop,
  shoulderCars: monoLoop,
  hipCars: monoLoop,
  ankle: monoLoop,
  breathing: monoLoop,
};
