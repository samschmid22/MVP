import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { FocusChips } from '../components/FocusChips';
import { HeroCard } from '../components/HeroCard';
import { Screen } from '../components/Screen';
import { TemplateCard } from '../components/TemplateCard';
import { goalById, GoalFocus } from '../data/goals';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { theme } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const columns = width >= 1080 ? 3 : 2;

  const workouts = useAppStore((state) => state.workouts);
  const workoutItems = useAppStore((state) => state.workoutItems);
  const exercises = useAppStore((state) => state.exercises);
  const lastWorkoutId = useAppStore((state) => state.lastWorkoutId);
  const selectedGoal = useAppStore((state) => state.user.selectedGoal);

  const initialFocus: GoalFocus = selectedGoal ? goalById[selectedGoal]?.focus ?? 'All' : 'All';
  const [focus, setFocus] = useState<GoalFocus>(initialFocus);

  useEffect(() => {
    setFocus(initialFocus);
  }, [initialFocus]);

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

  const reorderedTemplates = useMemo(() => {
    const preferredFocus = (selectedGoal && goalById[selectedGoal]?.focus) ?? null;
    if (!preferredFocus) return workouts;

    return [...workouts].sort((a, b) => {
      const aMatch = metaByWorkoutId[a.id]?.categories.has(preferredFocus) ? 1 : 0;
      const bMatch = metaByWorkoutId[b.id]?.categories.has(preferredFocus) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [metaByWorkoutId, selectedGoal, workouts]);

  const filteredTemplates = useMemo(
    () =>
      reorderedTemplates.filter((workout) => {
        if (focus === 'All') return true;
        return metaByWorkoutId[workout.id]?.categories.has(focus);
      }),
    [focus, metaByWorkoutId, reorderedTemplates],
  );

  const startWorkoutId = lastWorkout?.id ?? workouts[0]?.id ?? null;

  return (
    <Screen>
      <FlatList
        data={filteredTemplates}
        key={`${columns}_${focus}`}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        columnWrapperStyle={columns > 1 ? styles.columnRow : undefined}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <HeroCard
              title="Ready to move?"
              subtitle="Pick a flow, reset posture, and feel better today."
              primaryLabel="Start a workout"
              secondaryLabel="Build one"
              onPrimaryPress={() => {
                if (startWorkoutId) navigation.navigate('Player', { workoutId: startWorkoutId });
              }}
              onSecondaryPress={() => navigation.navigate('WorkoutBuilder')}
            />

            {lastWorkout ? (
              <Card accentColor={theme.colors.primary} accentPosition="left" style={styles.continueCard}>
                <View style={styles.continueThumb}>
                  <Ionicons name="body" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.continueTextWrap}>
                  <Text style={styles.continueLabel}>Continue workout</Text>
                  <Text style={styles.continueTitle}>{lastWorkout.name}</Text>
                  <Text style={styles.continueMeta}>
                    {metaByWorkoutId[lastWorkout.id]?.firstExerciseName} • {metaByWorkoutId[lastWorkout.id]?.minutes ?? 1}{' '}
                    min
                  </Text>
                </View>
                <PrimaryButton
                  label="Resume"
                  onPress={() => navigation.navigate('Player', { workoutId: lastWorkout.id })}
                  style={styles.resumeButton}
                />
              </Card>
            ) : null}

            <View style={styles.sectionHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Quick Start</Text>
                <Text style={styles.sectionSubtext}>Choose a flow and start in seconds.</Text>
              </View>
              <SecondaryButton
                label="+ Build workout"
                onPress={() => navigation.navigate('WorkoutBuilder')}
                style={styles.buildButton}
              />
            </View>

            <FocusChips value={focus} onChange={setFocus} />

            <Pressable onPress={() => navigation.navigate('Premium')}>
              <LinearGradient colors={theme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.premiumCard}>
                <View style={styles.premiumIconWrap}>
                  <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumTitle}>Type any exercise → instant cartoon</Text>
                  <Text style={styles.premiumText}>Generate custom moves with Premium.</Text>
                </View>
                <View style={styles.premiumCta}>
                  <Text style={styles.premiumCtaText}>Try Premium</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No templates for this focus yet</Text>
            <Text style={styles.emptyText}>Try another focus chip or build your own routine.</Text>
            <PrimaryButton label="Build workout" onPress={() => navigation.navigate('WorkoutBuilder')} />
          </Card>
        }
        renderItem={({ item }) => {
          const categories = metaByWorkoutId[item.id]?.categories;
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
              name={item.name}
              description={item.description}
              exerciseCount={metaByWorkoutId[item.id]?.itemCount ?? 0}
              minutes={metaByWorkoutId[item.id]?.minutes ?? 1}
              accent={accent}
              onEdit={() => navigation.navigate('WorkoutBuilder', { workoutId: item.id })}
              onStart={() => navigation.navigate('Player', { workoutId: item.id })}
              style={styles.templateCard}
            />
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 116,
    gap: theme.spacing.md,
  },
  headerContent: {
    gap: theme.spacing.md,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingLeft: theme.spacing.lg,
  },
  continueThumb: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.pastelBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueTextWrap: {
    flex: 1,
    gap: 1,
  },
  continueLabel: {
    ...theme.typography.micro,
    color: theme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  continueTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    fontSize: 18,
  },
  continueMeta: {
    ...theme.typography.small,
    color: theme.colors.muted,
  },
  resumeButton: {
    minWidth: 90,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  sectionSubtext: {
    ...theme.typography.small,
    color: theme.colors.muted,
  },
  buildButton: {
    minWidth: 134,
  },
  premiumCard: {
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  premiumIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTitle: {
    color: '#FFFFFF',
    ...theme.typography.small,
    fontWeight: '600',
  },
  premiumText: {
    color: '#EFF6FF',
    ...theme.typography.micro,
    fontWeight: '500',
  },
  premiumCta: {
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.34)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs + 2,
  },
  premiumCtaText: {
    color: '#FFFFFF',
    ...theme.typography.small,
    fontWeight: '600',
  },
  columnRow: {
    gap: theme.spacing.sm,
  },
  templateCard: {
    flex: 1,
    marginTop: theme.spacing.sm,
  },
  emptyCard: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  emptyTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
});
