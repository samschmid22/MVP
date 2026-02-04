import { UserPreference } from '../types/models';

export type GoalFocus = 'All' | 'Mobility' | 'Posture' | 'Stability' | 'Balance';

export type GoalOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
  focus: Exclude<GoalFocus, 'All'>;
  preference: UserPreference;
};

export const goalOptions: GoalOption[] = [
  {
    id: 'goal_desk_posture',
    title: 'Fix Desk Posture',
    description: 'Undo rounded shoulders and neck tension.',
    icon: 'desktop-outline',
    focus: 'Posture',
    preference: 'Posture',
  },
  {
    id: 'goal_hip_mobility',
    title: 'Hip Mobility',
    description: 'Open hips for easier squats and daily movement.',
    icon: 'walk-outline',
    focus: 'Mobility',
    preference: 'Mobility',
  },
  {
    id: 'goal_back_neck_relief',
    title: 'Back & Neck Relief',
    description: 'Gentle mobility for stiff upper and low back.',
    icon: 'fitness-outline',
    focus: 'Posture',
    preference: 'Flexibility',
  },
  {
    id: 'goal_core_stability',
    title: 'Core Stability',
    description: 'Build trunk control for better posture and power.',
    icon: 'shield-checkmark-outline',
    focus: 'Stability',
    preference: 'Stability',
  },
  {
    id: 'goal_balance_ankles',
    title: 'Balance & Ankles',
    description: 'Improve single-leg control and ankle confidence.',
    icon: 'footsteps-outline',
    focus: 'Balance',
    preference: 'Balance',
  },
  {
    id: 'goal_full_body_reset',
    title: 'Full Body Reset',
    description: 'A balanced blend for energy and recovery.',
    icon: 'body-outline',
    focus: 'Mobility',
    preference: 'Mobility',
  },
  {
    id: 'goal_splits_prep',
    title: 'Splits Prep',
    description: 'Progressive flexibility with controlled holds.',
    icon: 'git-compare-outline',
    focus: 'Mobility',
    preference: 'Flexibility',
  },
  {
    id: 'goal_preworkout',
    title: 'Pre-Workout Warmup',
    description: 'Activate joints and muscles before training.',
    icon: 'flame-outline',
    focus: 'Stability',
    preference: 'Stability',
  },
  {
    id: 'goal_recovery',
    title: 'Recovery Day',
    description: 'Low-intensity flow to recover and reset.',
    icon: 'leaf-outline',
    focus: 'Balance',
    preference: 'Balance',
  },
];

export const goalById = Object.fromEntries(goalOptions.map((goal) => [goal.id, goal])) as Record<
  string,
  GoalOption
>;
