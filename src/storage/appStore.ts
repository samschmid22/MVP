import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { seedExercises } from '../data/seedExercises';
import { Exercise, Settings, User, Workout, WorkoutItem } from '../types/models';
import { createId } from '../utils/id';
import { normalizeText } from '../utils/text';

interface AppState {
  hydrated: boolean;
  onboardingCompleted: boolean;
  exercises: Exercise[];
  workouts: Workout[];
  workoutItems: WorkoutItem[];
  user: User;
  settings: Settings;
  lastWorkoutId: string | null;
  markHydrated: () => void;
  completeOnboarding: (payload: {
    preferences: User['preferences'];
    selectedGoal: User['selectedGoal'];
  }) => void;
  initializeData: () => void;
  setPremium: (value: boolean) => void;
  toggleFavorite: (exerciseId: string) => void;
  addCustomExercise: (exercise: Omit<Exercise, 'id' | 'normalizedName' | 'isCustom'>) => Exercise;
  saveWorkout: (
    workout: { id?: string; name: string; description: string },
    items: Array<{ id?: string; exerciseId: string; durationSec: number; restSec: number }>,
  ) => string;
  deleteWorkout: (workoutId: string) => void;
  duplicateWorkout: (workoutId: string) => void;
  setLastWorkout: (workoutId: string | null) => void;
  updateSettings: (patch: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  units: 'metric',
  soundEnabled: true,
  vibrationEnabled: true,
};

const defaultUser: User = {
  preferences: ['Mobility'],
  selectedGoal: null,
  isPremium: false,
  favoriteExerciseIds: [],
};

const createTemplateWorkout = (
  id: string,
  name: string,
  description: string,
): Workout => ({
  id,
  name,
  description,
  createdAt: new Date().toISOString(),
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingCompleted: false,
      exercises: [],
      workouts: [],
      workoutItems: [],
      user: defaultUser,
      settings: defaultSettings,
      lastWorkoutId: null,
      markHydrated: () => set({ hydrated: true }),
      completeOnboarding: ({ preferences, selectedGoal }) =>
        set((state) => ({
          onboardingCompleted: true,
          user: { ...state.user, preferences, selectedGoal },
        })),
      initializeData: () => {
        const state = get();
        if (state.exercises.length > 0) return;

        const templateWorkouts: Workout[] = [
          createTemplateWorkout('wo_template_1', 'Morning Mobility', 'Quick hips + spine prep'),
          createTemplateWorkout('wo_template_2', 'Desk Reset Posture', 'Upper body posture reset'),
          createTemplateWorkout('wo_template_3', 'Balance Builder', 'Single-leg balance progression'),
        ];

        const items: WorkoutItem[] = [
          {
            id: createId('item'),
            workoutId: templateWorkouts[0].id,
            exerciseId: 'ex_1',
            orderIndex: 0,
            durationSec: 45,
            restSec: 15,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[0].id,
            exerciseId: 'ex_4',
            orderIndex: 1,
            durationSec: 60,
            restSec: 15,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[0].id,
            exerciseId: 'ex_7',
            orderIndex: 2,
            durationSec: 45,
            restSec: 0,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[1].id,
            exerciseId: 'ex_9',
            orderIndex: 0,
            durationSec: 45,
            restSec: 10,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[1].id,
            exerciseId: 'ex_11',
            orderIndex: 1,
            durationSec: 45,
            restSec: 10,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[1].id,
            exerciseId: 'ex_15',
            orderIndex: 2,
            durationSec: 60,
            restSec: 0,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[2].id,
            exerciseId: 'ex_25',
            orderIndex: 0,
            durationSec: 40,
            restSec: 20,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[2].id,
            exerciseId: 'ex_29',
            orderIndex: 1,
            durationSec: 40,
            restSec: 20,
          },
          {
            id: createId('item'),
            workoutId: templateWorkouts[2].id,
            exerciseId: 'ex_32',
            orderIndex: 2,
            durationSec: 30,
            restSec: 0,
          },
        ];

        set({
          exercises: seedExercises,
          workouts: templateWorkouts,
          workoutItems: items,
        });
      },
      setPremium: (value) =>
        set((state) => ({
          user: { ...state.user, isPremium: value },
        })),
      toggleFavorite: (exerciseId) =>
        set((state) => {
          const exists = state.user.favoriteExerciseIds.includes(exerciseId);
          return {
            user: {
              ...state.user,
              favoriteExerciseIds: exists
                ? state.user.favoriteExerciseIds.filter((id) => id !== exerciseId)
                : [...state.user.favoriteExerciseIds, exerciseId],
            },
          };
        }),
      addCustomExercise: (exercise) => {
        const newExercise: Exercise = {
          ...exercise,
          id: createId('custom_ex'),
          normalizedName: normalizeText(exercise.name),
          isCustom: true,
        };

        set((state) => ({ exercises: [newExercise, ...state.exercises] }));
        return newExercise;
      },
      saveWorkout: (workoutInput, itemsInput) => {
        const workoutId = workoutInput.id ?? createId('wo');

        const nextWorkout: Workout = {
          id: workoutId,
          name: workoutInput.name,
          description: workoutInput.description,
          createdAt: workoutInput.id
            ? get().workouts.find((w) => w.id === workoutInput.id)?.createdAt ?? new Date().toISOString()
            : new Date().toISOString(),
        };

        const nextItems: WorkoutItem[] = itemsInput.map((item, index) => ({
          id: item.id ?? createId('item'),
          workoutId,
          exerciseId: item.exerciseId,
          orderIndex: index,
          durationSec: item.durationSec,
          restSec: item.restSec,
        }));

        set((state) => {
          const workouts = state.workouts.some((w) => w.id === workoutId)
            ? state.workouts.map((w) => (w.id === workoutId ? nextWorkout : w))
            : [nextWorkout, ...state.workouts];

          const workoutItems = [
            ...state.workoutItems.filter((item) => item.workoutId !== workoutId),
            ...nextItems,
          ];

          return { workouts, workoutItems };
        });

        return workoutId;
      },
      deleteWorkout: (workoutId) =>
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== workoutId),
          workoutItems: state.workoutItems.filter((i) => i.workoutId !== workoutId),
          lastWorkoutId: state.lastWorkoutId === workoutId ? null : state.lastWorkoutId,
        })),
      duplicateWorkout: (workoutId) => {
        const state = get();
        const sourceWorkout = state.workouts.find((w) => w.id === workoutId);
        if (!sourceWorkout) return;

        const sourceItems = state.workoutItems
          .filter((item) => item.workoutId === workoutId)
          .sort((a, b) => a.orderIndex - b.orderIndex);

        const duplicatedId = createId('wo');
        const duplicatedWorkout: Workout = {
          id: duplicatedId,
          name: `${sourceWorkout.name} Copy`,
          description: sourceWorkout.description,
          createdAt: new Date().toISOString(),
        };

        const duplicatedItems = sourceItems.map((item, orderIndex) => ({
          ...item,
          id: createId('item'),
          workoutId: duplicatedId,
          orderIndex,
        }));

        set({
          workouts: [duplicatedWorkout, ...state.workouts],
          workoutItems: [...state.workoutItems, ...duplicatedItems],
        });
      },
      setLastWorkout: (workoutId) => set({ lastWorkoutId: workoutId }),
      updateSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
        })),
    }),
    {
      name: 'bend-mvp-store-v1',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState, version) => {
        if (version < 2) {
          const state = persistedState as Partial<AppState>;
          return {
            ...state,
            user: { ...defaultUser, ...(state.user ?? {}) },
          } as AppState;
        }
        return persistedState as AppState;
      },
      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
        exercises: state.exercises,
        workouts: state.workouts,
        workoutItems: state.workoutItems,
        user: state.user,
        settings: state.settings,
        lastWorkoutId: state.lastWorkoutId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.user = { ...defaultUser, ...state.user };
        }
        state?.markHydrated();
      },
    },
  ),
);

export const useWorkoutItems = (workoutId: string) =>
  useAppStore((state) =>
    state.workoutItems
      .filter((item) => item.workoutId === workoutId)
      .sort((a, b) => a.orderIndex - b.orderIndex),
  );
