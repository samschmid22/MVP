import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ExerciseAnimation } from '../ui/components';
import { getAnimationKeyForExercise } from '../config/exerciseAnimationMap';
import { playCue } from '../services/cueService';
import { RootStackParamList } from '../navigation/types';
import { useAppStore, useWorkoutItems } from '../storage/appStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

type Phase = 'work' | 'rest' | 'done';

export const PlayerScreen = ({ route, navigation }: Props) => {
  const { workoutId } = route.params;
  const workouts = useAppStore((state) => state.workouts);
  const exercises = useAppStore((state) => state.exercises);
  const settings = useAppStore((state) => state.settings);
  const setLastWorkout = useAppStore((state) => state.setLastWorkout);
  const workoutItems = useWorkoutItems(workoutId);

  const workout = workouts.find((w) => w.id === workoutId);

  const sequence = useMemo(
    () =>
      workoutItems
        .map((item) => {
          const exercise = exercises.find((exerciseItem) => exerciseItem.id === item.exerciseId);
          if (!exercise) return null;
          return { item, exercise };
        })
        .filter((v): v is NonNullable<typeof v> => Boolean(v)),
    [exercises, workoutItems],
  );

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('work');
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [segmentTotal, setSegmentTotal] = useState(0);

  const endAtRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(0);
  const lastCountdownRef = useRef<number | null>(null);

  const current = sequence[index];
  const next = sequence[index + 1];

  const beginSegment = async (seconds: number, nextPhase: Phase) => {
    const normalized = Math.max(0, seconds);
    setPhase(nextPhase);
    setSegmentTotal(normalized);
    setRemaining(normalized);
    endAtRef.current = Date.now() + normalized * 1000;
    pausedRemainingRef.current = normalized;
    lastCountdownRef.current = null;
    setPaused(false);
    await playCue(settings.soundEnabled, settings.vibrationEnabled);
  };

  const runNext = async () => {
    if (!current) {
      setPhase('done');
      return;
    }

    const rest = current.item.restSec;

    if (phase === 'work' && rest > 0) {
      await beginSegment(rest, 'rest');
      return;
    }

    const nextIndex = index + 1;
    if (nextIndex >= sequence.length) {
      setPhase('done');
      setRemaining(0);
      setSegmentTotal(1);
      endAtRef.current = null;
      await playCue(settings.soundEnabled, settings.vibrationEnabled);
      return;
    }

    setIndex(nextIndex);
    await beginSegment(sequence[nextIndex].item.durationSec, 'work');
  };

  useEffect(() => {
    if (!workout || !current) return;
    setLastWorkout(workoutId);
    void beginSegment(current.item.durationSec, 'work');
  }, []);

  useEffect(() => {
    const onAppState = (state: AppStateStatus) => {
      if (state === 'active' && !paused && endAtRef.current) {
        const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
        setRemaining(left);
      }
    };

    const subscription = AppState.addEventListener('change', onAppState);
    return () => subscription.remove();
  }, [paused]);

  useEffect(() => {
    if (phase === 'done') return;

    const timer = setInterval(() => {
      if (paused || !endAtRef.current) return;

      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);

      if (left <= 3 && left > 0 && lastCountdownRef.current !== left) {
        lastCountdownRef.current = left;
        void playCue(settings.soundEnabled, settings.vibrationEnabled);
      }

      if (left === 0) {
        void runNext();
      }
    }, 150);

    return () => clearInterval(timer);
  }, [phase, paused, index, settings.soundEnabled, settings.vibrationEnabled]);

  if (!workout || sequence.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Workout not available</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'done') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.doneLabel}>Session complete</Text>
          <Text style={styles.doneTitle}>{workout.name}</Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = current.exercise;
  const progress = segmentTotal === 0 ? 0 : (segmentTotal - remaining) / segmentTotal;

  const animationKey = currentExercise ? getAnimationKeyForExercise(currentExercise) : 'mobility';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.phase}>{phase === 'work' ? 'WORK' : 'REST'}</Text>
      </View>

      <View style={styles.mediaWrap}>
        <ExerciseAnimation animationKey={animationKey} size="player" />
        <View style={styles.overlay}>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        </View>
      </View>

      <View style={styles.timerWrap}>
        <Text style={styles.timerText}>{remaining}s</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progress * 100))}%` }]} />
        </View>
        <Text style={styles.upcoming}>Up next: {next?.exercise.name ?? 'Finish'}</Text>
      </View>

      <View style={styles.controlsRow}>
        <Pressable
          style={styles.controlBtn}
          onPress={() => {
            if (index === 0 && phase === 'work') return;
            const prevIndex = Math.max(index - 1, 0);
            setIndex(prevIndex);
            void beginSegment(sequence[prevIndex].item.durationSec, 'work');
          }}
        >
          <Text style={styles.controlText}>Prev</Text>
        </Pressable>
        <Pressable
          style={[styles.controlBtn, styles.primaryControl]}
          onPress={() => {
            if (paused) {
              endAtRef.current = Date.now() + pausedRemainingRef.current * 1000;
              setPaused(false);
            } else {
              pausedRemainingRef.current = remaining;
              endAtRef.current = null;
              setPaused(true);
            }
          }}
        >
          <Text style={[styles.controlText, styles.primaryControlText]}>{paused ? 'Resume' : 'Pause'}</Text>
        </Pressable>
        <Pressable style={styles.controlBtn} onPress={() => void runNext()}>
          <Text style={styles.controlText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.secondaryControls}>
        <Pressable
          style={styles.extendBtn}
          onPress={() => {
            endAtRef.current = (endAtRef.current ?? Date.now()) + 10000;
            setRemaining((prev) => prev + 10);
            setSegmentTotal((prev) => prev + 10);
          }}
        >
          <Text style={styles.extendText}>+10s</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  header: { paddingHorizontal: 18, paddingTop: 10, gap: 6 },
  workoutName: { color: '#e2e8f0', fontWeight: '700', fontSize: 16 },
  phase: { color: '#22d3ee', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  mediaWrap: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 300,
    backgroundColor: '#EEF0F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(2,6,23,0.5)',
  },
  exerciseName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  timerWrap: { padding: 18, gap: 10 },
  timerText: {
    fontSize: 66,
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22d3ee',
  },
  upcoming: { color: '#cbd5e1', textAlign: 'center', fontWeight: '600' },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  controlBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    alignItems: 'center',
  },
  controlText: { color: '#e2e8f0', fontWeight: '700' },
  primaryControl: { backgroundColor: '#22d3ee', borderColor: '#22d3ee' },
  primaryControlText: { color: '#083344' },
  secondaryControls: { padding: 16, alignItems: 'center' },
  extendBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  extendText: { color: '#cbd5e1', fontWeight: '700' },
  doneLabel: { color: '#5eead4', fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  doneTitle: { color: '#fff', fontSize: 30, fontWeight: '900', textAlign: 'center' },
  emptyTitle: { color: '#fff', fontWeight: '700', fontSize: 20 },
  primaryButton: {
    borderRadius: 12,
    backgroundColor: '#22d3ee',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: { fontWeight: '800', color: '#083344' },
});
