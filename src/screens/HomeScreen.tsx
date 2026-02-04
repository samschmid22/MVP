import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { GoalFocus, goalById } from '../data/goals';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { AppText, Button, Card, Chip, Screen, SectionHeader } from '../ui/components';
import { brandByCategory, uiTheme } from '../ui/theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type TemplateMeta = {
  itemCount: number;
  minutes: number;
  categories: Set<string>;
  firstExerciseName: string;
};

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const columns = width >= 980 ? 3 : 2;

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

  const metaByWorkoutId = useMemo<Record<string, TemplateMeta>>(
    () =>
      Object.fromEntries(
        workouts.map((workout) => {
          const items = workoutItems
            .filter((item) => item.workoutId === workout.id)
            .sort((a, b) => a.orderIndex - b.orderIndex);

          const totalSeconds = items.reduce((sum, item) => sum + item.durationSec + item.restSec, 0);
          const categories = new Set(
            items
              .map((item) => exerciseMap[item.exerciseId]?.category)
              .filter((value): value is NonNullable<typeof value> => Boolean(value)),
          );

          return [
            workout.id,
            {
              itemCount: items.length,
              minutes: Math.max(1, Math.round(totalSeconds / 60)),
              categories,
              firstExerciseName: exerciseMap[items[0]?.exerciseId]?.name ?? 'Custom flow',
            },
          ];
        }),
      ),
    [exerciseMap, workoutItems, workouts],
  );

  const reorderedTemplates = useMemo(() => {
    const preferredFocus = selectedGoal ? goalById[selectedGoal]?.focus ?? null : null;
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

  const lastWorkout = workouts.find((workout) => workout.id === lastWorkoutId) ?? null;
  const startWorkoutId = lastWorkout?.id ?? workouts[0]?.id ?? null;

  const renderHeader = (
    <View style={styles.headerContent}>
      <LinearGradient colors={uiTheme.gradients.brandSoft} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroText}>
          <AppText variant="h1">Ready to move?</AppText>
          <AppText variant="body" style={styles.mutedText}>
            Pick a flow, reset posture, and feel better today.
          </AppText>
        </View>
        <View style={styles.heroActions}>
          <Button
            label="Start a workout"
            variant="primary"
            onPress={() => {
              if (startWorkoutId) navigation.navigate('Player', { workoutId: startWorkoutId });
            }}
            style={styles.flexButton}
          />
          <Button
            label="Build one"
            variant="secondary"
            onPress={() => navigation.navigate('WorkoutBuilder')}
            style={styles.flexButton}
          />
        </View>
      </LinearGradient>

      {lastWorkout ? (
        <Card accent>
          <View style={styles.continueRow}>
            <View style={styles.iconTile}>
              <Ionicons name="body-outline" size={22} color={uiTheme.colors.brandPurple} />
            </View>
            <View style={styles.flexBlock}>
              <AppText variant="caption" style={styles.upperMuted}>
                Continue
              </AppText>
              <AppText variant="h3">{lastWorkout.name}</AppText>
              <AppText variant="caption" style={styles.mutedText}>
                {metaByWorkoutId[lastWorkout.id]?.firstExerciseName} • {metaByWorkoutId[lastWorkout.id]?.minutes ?? 1} min
              </AppText>
            </View>
            <Button
              label="Resume"
              variant="primary"
              onPress={() => navigation.navigate('Player', { workoutId: lastWorkout.id })}
            />
          </View>
        </Card>
      ) : (
        <Card accent>
          <View style={styles.nowContent}>
            <AppText variant="h3">No active workout</AppText>
            <AppText variant="caption" style={styles.mutedText}>
              Start a quick flow or build one in a few taps.
            </AppText>
            <View style={styles.nowActions}>
              <Button
                label="Start"
                variant="primary"
                onPress={() => {
                  if (startWorkoutId) navigation.navigate('Player', { workoutId: startWorkoutId });
                }}
                style={styles.flexButton}
              />
              <Button label="Build" variant="secondary" onPress={() => navigation.navigate('WorkoutBuilder')} style={styles.flexButton} />
            </View>
          </View>
        </Card>
      )}

      <SectionHeader
        title="Quick Start"
        subtitle="Choose a flow and start in seconds."
        actionLabel="+ Build workout"
        onActionPress={() => navigation.navigate('WorkoutBuilder')}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {(['All', 'Mobility', 'Posture', 'Stability', 'Balance'] as GoalFocus[]).map((item) => (
          <Chip key={item} label={item} selected={focus === item} onPress={() => setFocus(item)} />
        ))}
      </ScrollView>

      <Pressable onPress={() => navigation.navigate('Premium')}>
        <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.premiumCard}>
          <View style={styles.premiumIcon}>
            <Ionicons name="sparkles-outline" size={18} color={uiTheme.colors.white} />
          </View>
          <View style={styles.flexBlock}>
            <AppText variant="body" style={styles.premiumTitle}>
              Type any exercise → instant cartoon
            </AppText>
            <AppText variant="caption" style={styles.premiumSubtitle}>
              Unlock custom generation with Premium.
            </AppText>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={filteredTemplates}
        key={`${columns}_${focus}`}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={columns > 1 ? styles.columnRow : undefined}
        contentContainerStyle={styles.content}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Card>
            <AppText variant="h3">No routines for this filter</AppText>
            <AppText variant="caption" style={styles.mutedText}>
              Try another chip or build your own workout.
            </AppText>
            <Button label="Build workout" variant="primary" onPress={() => navigation.navigate('WorkoutBuilder')} />
          </Card>
        }
        renderItem={({ item }) => {
          const categories = metaByWorkoutId[item.id]?.categories;
          const category =
            categories?.has('Posture')
              ? 'Posture'
              : categories?.has('Stability')
                ? 'Stability'
                : categories?.has('Balance')
                  ? 'Balance'
                  : 'Mobility';
          const accent = brandByCategory[category];

          return (
            <Card style={styles.templateCard}>
              <LinearGradient colors={uiTheme.gradients.brandSoft} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.templateStrip} />
              <View style={styles.templateTop}>
                <View style={[styles.templateIcon, { backgroundColor: `${accent}20` }]}>
                  <Ionicons name="body-outline" size={16} color={accent} />
                </View>
                <Pressable onPress={() => navigation.navigate('WorkoutBuilder', { workoutId: item.id })} hitSlop={8}>
                  <Ionicons name="pencil-outline" size={16} color={uiTheme.colors.muted} />
                </Pressable>
              </View>
              <AppText variant="h3" numberOfLines={1}>
                {item.name}
              </AppText>
              <AppText variant="caption" style={styles.mutedText} numberOfLines={2}>
                {item.description || 'Move, breathe, and feel better.'}
              </AppText>
              <AppText variant="caption" style={styles.metaText}>
                {metaByWorkoutId[item.id]?.itemCount ?? 0} exercises • {metaByWorkoutId[item.id]?.minutes ?? 1} min
              </AppText>
              <Button label="Start" variant="primary" onPress={() => navigation.navigate('Player', { workoutId: item.id })} />
            </Card>
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: uiTheme.spacing.sm,
    paddingBottom: 118,
    gap: uiTheme.spacing.md,
  },
  headerContent: {
    gap: uiTheme.spacing.md,
  },
  hero: {
    borderRadius: uiTheme.radius.xl,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    padding: uiTheme.spacing.lg,
    gap: uiTheme.spacing.md,
    ...uiTheme.shadows.soft,
  },
  heroText: {
    gap: uiTheme.spacing.xs,
  },
  heroActions: {
    flexDirection: 'row',
    gap: uiTheme.spacing.sm,
  },
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.sm,
  },
  nowContent: {
    gap: uiTheme.spacing.sm,
  },
  nowActions: {
    flexDirection: 'row',
    gap: uiTheme.spacing.sm,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: uiTheme.radius.md,
    backgroundColor: uiTheme.colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBlock: {
    flex: 1,
    gap: uiTheme.spacing.xs,
  },
  flexButton: {
    flex: 1,
  },
  upperMuted: {
    color: uiTheme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mutedText: {
    color: uiTheme.colors.muted,
  },
  chipsRow: {
    gap: uiTheme.spacing.sm,
    paddingRight: uiTheme.spacing.sm,
  },
  premiumCard: {
    borderRadius: uiTheme.radius.lg,
    padding: uiTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.sm,
    ...uiTheme.shadows.soft,
  },
  premiumIcon: {
    width: 30,
    height: 30,
    borderRadius: uiTheme.radius.pill,
    backgroundColor: uiTheme.colors.whiteOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTitle: {
    color: uiTheme.colors.white,
    fontWeight: '600',
  },
  premiumSubtitle: {
    color: uiTheme.colors.whiteSoft,
  },
  columnRow: {
    gap: uiTheme.spacing.sm,
  },
  templateCard: {
    flex: 1,
    marginTop: uiTheme.spacing.sm,
    gap: uiTheme.spacing.sm,
  },
  templateStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  templateTop: {
    marginTop: uiTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateIcon: {
    width: 28,
    height: 28,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    color: uiTheme.colors.brandPurple,
    fontWeight: '600',
  },
});
