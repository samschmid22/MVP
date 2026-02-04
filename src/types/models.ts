export type ExerciseCategory =
  | 'Mobility'
  | 'Posture'
  | 'Stability'
  | 'Balance'
  | 'Warmup'
  | 'Cooldown';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type MediaType = 'lottie' | 'video';

export type UserPreference = 'Mobility' | 'Posture' | 'Stability' | 'Balance' | 'Flexibility';

export interface Exercise {
  id: string;
  name: string;
  normalizedName: string;
  category: ExerciseCategory;
  tags: string[];
  bodyAreas: string[];
  difficulty: Difficulty;
  instructions: string;
  defaultDurationSec: number;
  mediaType: MediaType;
  mediaUrl: string;
  isCustom: boolean;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface WorkoutItem {
  id: string;
  workoutId: string;
  exerciseId: string;
  orderIndex: number;
  durationSec: number;
  restSec: number;
}

export interface User {
  preferences: UserPreference[];
  selectedGoal: string | null;
  isPremium: boolean;
  favoriteExerciseIds: string[];
}

export interface Settings {
  units: 'metric' | 'imperial';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
