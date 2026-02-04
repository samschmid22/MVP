import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FocusChips } from '../components/FocusChips';
import { HeroCard } from '../components/HeroCard';
import { Screen } from '../components/Screen';
import { TemplateCard } from '../components/TemplateCard';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { theme } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type FocusValue = 'All' | 'Mobility' | 'Posture' | 'Stability' | 'Balance';

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const workouts = useAppStore((state) => state.workouts);
  const workoutItems = useAppStore((state) => state.workoutItems);
  const exercises = useAppStore((state) => state.exercises);
  const lastWorkoutId = useAppStore((state) => state.lastWorkoutId);

  const [focus, setFocus] = useState<FocusValue>('All');

  const exerciseMap = useMemo(
    () => Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  );

  const metaByWorkoutId = useMemo(
    () =>
      Object.fromEntries(
        workouts.map((workout) => {
          const items = workoutItems
            .filter((item) => item.workoutId === workout.id)
            .sort((a, b) => a.orderIndex - b.orderIndex);

          const totalSeconds = items.reduce((sum, item) => sum + item.durationSec + item.restSec, 0);
          const minutes = Math.max(1, Math.round(totalSeconds / 60));
          const categories = new Set(
            items
              .map((item) => exerciseMap[item.exerciseId]?.category)
              .filter((value): value is NonNullable<typeof value> => Boolean(value)),
          );

          return [
            workout.id,
            {
              itemCount: items.length,
              totalSeconds,
              minutes,
              categories,
              firstExerciseName: exerciseMap[items[0]?.exerciseId]?.name ?? 'Custom flow',
            },
          ];
        }),
      ),
    [exerciseMap, workoutItems, workouts],
  );

  const lastWorkout = workouts.find((workout) => workout.id === lastWorkoutId) ?? null;

  const filteredTemplates = useMemo(
    () =>
      workouts.filter((workout) => {
        if (focus === 'All') return true;
        return metaByWorkoutId[workout.id]?.categories.has(focus);
      }),
    [focus, metaByWorkoutId, workouts],
  );

  const startWorkoutId = lastWorkout?.id ?? workouts[0]?.id ?? null;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard
          title="Ready to move?"
          subtitle="Pick a flow, reset your posture, and keep your body feeling good today."
          primaryLabel="Start a workout"
          secondaryLabel="Build one"
          onPrimaryPress={() => {
            if (startWorkoutId) navigation.navigate('Player', { workoutId: startWorkoutId });
          }}
          onSecondaryPress={() => navigation.navigate('WorkoutBuilder')}
        />

        {lastWorkout ? (
          <View style={styles.continueCard}>
            <View style={styles.accentBar} />
            <View style={styles.continueThumb}>
              <Ionicons name="body" size={24} color={theme.colors.text} />
            </View>
            <View style={styles.continueTextWrap}>
              <Text style={styles.continueLabel}>Continue</Text>
              <Text style={styles.continueTitle}>{lastWorkout.name}</Text>
              <Text style={styles.continueMeta}>
                {metaByWorkoutId[lastWorkout.id]?.firstExerciseName} - {metaByWorkoutId[lastWorkout.id]?.minutes ?? 1} min
              </Text>
            </View>
            <Pressable
              style={styles.resumeButton}
              onPress={() => navigation.navigate('Player', { workoutId: lastWorkout.id })}
            >
              <Text style={styles.resumeButtonText}>Resume</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <Text style={styles.sectionSubtext}>Pick a focus and hit play</Text>
        </View>

        <FocusChips value={focus} onChange={setFocus} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templatesRow}>
          {filteredTemplates.map((workout) => {
            const categories = metaByWorkoutId[workout.id]?.categories;
            const accent =
              categories?.has('Posture')
                ? theme.category.Posture
                : categories?.has('Stability')
                  ? theme.category.Stability
                  : categories?.has('Balance')
                    ? theme.category.Balance
                    : theme.category.Mobility;

            return (
              <TemplateCard
                key={workout.id}
                name={workout.name}
                description={workout.description}
                exerciseCount={metaByWorkoutId[workout.id]?.itemCount ?? 0}
                minutes={metaByWorkoutId[workout.id]?.minutes ?? 1}
                accent={accent}
                onEdit={() => navigation.navigate('WorkoutBuilder', { workoutId: workout.id })}
                onStart={() => navigation.navigate('Player', { workoutId: workout.id })}
              />
            );
          })}
        </ScrollView>

        <Pressable style={styles.buildButton} onPress={() => navigation.navigate('WorkoutBuilder')}>
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text style={styles.buildButtonText}>Build workout</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Premium')}>
          <LinearGradient
            colors={theme.gradients.premium}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumCard}
          >
            <View style={styles.premiumIconWrap}>
              <Ionicons name="sparkles" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.premiumTitle}>Type any exercise to instant cartoon</Text>
              <Text style={styles.premiumText}>Unlock premium generation tools</Text>
            </View>
            <View style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Try Premium</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
    gap: theme.spacing.lg,
  },
  continueCard: {
    backgroundColor: '#FFFFFFE6',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadow.soft,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: theme.category.Mobility,
  },
  continueThumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueTextWrap: {
    flex: 1,
    gap: 2,
  },
  continueLabel: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  continueTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  continueMeta: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  resumeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  resumeButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    ...theme.type.h2,
    color: theme.colors.text,
    fontSize: 22,
  },
  sectionSubtext: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  templatesRow: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.sm,
  },
  buildButton: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...theme.shadow.card,
  },
  buildButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  premiumCard: {
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...theme.shadow.card,
  },
  premiumIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 2,
  },
  premiumText: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '600',
  },
  premiumButton: {
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
