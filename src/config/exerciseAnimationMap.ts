import { Exercise } from '../types/models';

export type AnimationKey =
  | 'mobility'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'push'
  | 'pull'
  | 'plank'
  | 'twist'
  | 'neck'
  | 'shoulderCars'
  | 'hipCars'
  | 'ankle'
  | 'breathing';

type KeywordMap = Array<[AnimationKey, string[]]>;

const tagPriority: KeywordMap = [
  ['breathing', ['breathing', 'breath', 'diaphragm']],
  ['neck', ['neck', 'cervical']],
  ['shoulderCars', ['shoulder cars', 'shoulder', 'scap', 'rotator']],
  ['hipCars', ['hip cars', 'hip', 'glute']],
  ['ankle', ['ankle', 'achilles', 'calf']],
  ['twist', ['twist', 'rotation', 'rotational', 'anti-rotation']],
  ['plank', ['plank', 'core hold', 'hollow', 'side plank']],
  ['push', ['push', 'press', 'pushup', 'push-up']],
  ['pull', ['pull', 'row', 'chin', 'pullup', 'pull-up']],
  ['lunge', ['lunge', 'split squat', 'split-squat']],
  ['squat', ['squat', 'sit', 'chair', 'goblet']],
  ['hinge', ['hinge', 'deadlift', 'good morning']],
  ['mobility', ['mobility', 'stretch', 'flexibility', 'warmup', 'cooldown']],
];

const normalize = (value: string) => value.trim().toLowerCase();

const findByKeywords = (values: string[]): AnimationKey | null => {
  const normalized = values.map(normalize);

  for (const [key, keywords] of tagPriority) {
    if (normalized.some((value) => keywords.some((keyword) => value.includes(keyword)))) {
      return key;
    }
  }

  return null;
};

export const getAnimationKeyForExercise = (exercise: Exercise): AnimationKey => {
  const tagMatch = findByKeywords(exercise.tags);
  if (tagMatch) return tagMatch;

  const nameMatch = findByKeywords([exercise.name, exercise.normalizedName]);
  if (nameMatch) return nameMatch;

  switch (exercise.category) {
    case 'Stability':
      return 'plank';
    case 'Balance':
      return 'ankle';
    case 'Posture':
      return 'shoulderCars';
    default:
      return 'mobility';
  }
};
