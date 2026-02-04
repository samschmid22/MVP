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
    title: 'Desk Posture Reset',
    description: 'Open chest and reset upper-back alignment.',
    icon: 'desktop-outline',
    focus: 'Posture',
    preference: 'Posture',
  },
  {
    id: 'goal_hip_splits',
    title: 'Hip Mobility + Splits',
    description: 'Deep hip openers with gradual split prep.',
    icon: 'walk-outline',
    focus: 'Mobility',
    preference: 'Mobility',
  },
  {
    id: 'goal_back_neck_relief',
    title: 'Back + Neck Relief',
    description: 'Ease stiffness from long desk sessions.',
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
    title: 'Balance + Ankles',
    description: 'Build confident single-leg stability.',
    icon: 'footsteps-outline',
    focus: 'Balance',
    preference: 'Balance',
  },
  {
    id: 'goal_knees_legs',
    title: 'Knees + Legs Support',
    description: 'Strengthen support around knees and hips.',
    icon: 'shield-outline',
    focus: 'Stability',
    preference: 'Stability',
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
    title: 'Recovery + Relax (low intensity)',
    description: 'Light movement for nervous-system reset.',
    icon: 'leaf-outline',
    focus: 'Balance',
    preference: 'Balance',
  },
  {
    id: 'goal_full_body_reset',
    title: 'Full Body Reset',
    description: 'Total-body flow to move and feel better fast.',
    icon: 'body-outline',
    focus: 'Mobility',
    preference: 'Mobility',
  },
];

export const goalById = Object.fromEntries(goalOptions.map((goal) => [goal.id, goal])) as Record<
  string,
  GoalOption
>;
