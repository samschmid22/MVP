export type RootStackParamList = {
  MainTabs: undefined;
  Onboarding: undefined;
  WorkoutBuilder: { workoutId?: string } | undefined;
  Player: { workoutId: string };
  Premium: undefined;
  Paywall: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Settings: undefined;
};
