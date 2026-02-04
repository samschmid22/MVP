import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoalFocus, goalById } from '../data/goals';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { AppText, Button, Card, Chip, Screen, SectionHeader, getFloatingTabBarPadding } from '../ui/components';
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
  const insets = useSafeAreaInsets();
  const columns = width >= 980 ? 3 : 2;

  const workouts = useAppStore((state) => state.workouts);
  const workoutItems = useAppStore((state) => state.workoutItems);
  const exercises = useAppStore((state) => state.exercises);
  const lastWorkoutId = useAppStore((state) => state.lastWorkoutId);
  const selectedGoal = useAppStore((state) => state.user.selectedGoal);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

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

  const handleStartWorkout = () => {
    if (startWorkoutId) {
      navigation.navigate('Player', { workoutId: startWorkoutId });
      return;
    }
    Alert.alert('Coming soon', 'Create a routine first, then you can start it here.');
  };

  const renderHeader = (
    <View style={styles.headerContent}>
      <Card style={[styles.hero, styles.sectionSurface]}>
        <View style={styles.heroTop}>
          <View style={styles.heroText}>
            <AppText variant="h1">Start a session</AppText>
            <AppText variant="body" style={styles.mutedText}>
              Choose a routine or build one.
            </AppText>
          </View>
          <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroBadge}>
            <Ionicons name="sparkles-outline" size={18} color={uiTheme.colors.white} />
          </LinearGradient>
        </View>
        <Button label="Start a workout" variant="primary" onPress={handleStartWorkout} style={styles.fullWidthButton} />
      </Card>

      {lastWorkout ? (
        <Card style={styles.sectionSurface}>
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
              style={styles.resumeButton}
            />
          </View>
        </Card>
      ) : (
        <Card style={styles.sectionSurface}>
          <View style={styles.nowContent}>
            <AppText variant="h3">No session in progress</AppText>
            <AppText variant="caption" style={styles.mutedText}>
              Start a workout from the hero or build a routine from Quick Start.
            </AppText>
          </View>
        </Card>
      )}

      <SectionHeader
        title="Quick Start"
        subtitle="Pick a template and begin in seconds."
        actionLabel="Build workout"
        actionVariant="outline"
        onActionPress={() => navigation.navigate('WorkoutBuilder')}
      />

      <View style={styles.chipsRow}>
        {(['All', 'Mobility', 'Posture', 'Stability', 'Balance'] as GoalFocus[]).map((item) => (
          <Chip key={item} label={item} selected={focus === item} onPress={() => setFocus(item)} />
        ))}
      </View>

      <Pressable onPress={() => setPremiumModalVisible(true)}>
        <Card style={[styles.premiumCard, styles.sectionSurface]}>
          <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.premiumIcon}>
            <Ionicons name="sparkles-outline" size={18} color={uiTheme.colors.white} />
          </LinearGradient>
          <View style={styles.flexBlock}>
            <AppText variant="body" style={styles.premiumTitle}>
              Generate an exercise cue card (Premium)
            </AppText>
            <AppText variant="caption" style={styles.mutedText}>
              Create custom guided cards from any exercise name.
            </AppText>
          </View>
        </Card>
      </Pressable>
      <Modal
        animationType="fade"
        transparent
        visible={premiumModalVisible}
        onRequestClose={() => setPremiumModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalCard}>
            <AppText variant="h3">Premium (Coming Soon)</AppText>
            <AppText variant="body" style={styles.mutedText}>
              Premium will unlock custom cue cards generated from any exercise name.
            </AppText>
            <View style={styles.modalActions}>
              <Button label="Not now" variant="ghost" onPress={() => setPremiumModalVisible(false)} style={styles.modalAction} />
              <Button
                label="Open Premium"
                variant="primary"
                onPress={() => {
                  setPremiumModalVisible(false);
                  navigation.navigate('Premium');
                }}
                style={styles.modalAction}
              />
            </View>
          </Card>
        </View>
      </Modal>
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
        contentContainerStyle={[styles.content, { paddingBottom: getFloatingTabBarPadding(insets.bottom) + uiTheme.spacing.lg }]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Card>
            <AppText variant="h3">No routines for this filter</AppText>
            <AppText variant="caption" style={styles.mutedText}>
              Try another chip or build your own workout.
            </AppText>
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
                {item.description || 'Structured mobility and posture work.'}
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
    paddingTop: uiTheme.spacing.md,
    gap: uiTheme.spacing.lg,
  },
  headerContent: {
    gap: uiTheme.spacing.lg,
  },
  hero: {
    gap: uiTheme.spacing.lg,
  },
  sectionSurface: {
    backgroundColor: uiTheme.colors.surfaceAlt,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.md,
  },
  heroText: {
    flex: 1,
    gap: uiTheme.spacing.xs,
  },
  heroBadge: {
    width: 38,
    height: 38,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...uiTheme.shadows.soft,
  },
  continueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.md,
  },
  nowContent: {
    gap: uiTheme.spacing.xs,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: uiTheme.radius.md,
    backgroundColor: uiTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBlock: {
    flex: 1,
    gap: uiTheme.spacing.xs,
  },
  upperMuted: {
    color: uiTheme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mutedText: {
    color: uiTheme.colors.muted,
  },
  fullWidthButton: {
    alignSelf: 'stretch',
  },
  resumeButton: {
    minWidth: 90,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: uiTheme.spacing.sm,
  },
  premiumCard: {
    borderRadius: uiTheme.radius.lg,
    padding: uiTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.md,
  },
  premiumIcon: {
    width: 34,
    height: 34,
    borderRadius: uiTheme.radius.pill,
    backgroundColor: uiTheme.colors.whiteOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumTitle: {
    color: uiTheme.colors.text,
    fontWeight: '600',
  },
  columnRow: {
    gap: uiTheme.spacing.md,
  },
  templateCard: {
    flex: 1,
    marginTop: uiTheme.spacing.md,
    gap: uiTheme.spacing.md,
  },
  templateTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateIcon: {
    width: 32,
    height: 32,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    color: uiTheme.colors.subtext,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,15,24,0.2)',
    justifyContent: 'center',
    paddingHorizontal: uiTheme.spacing.lg,
  },
  modalCard: {
    gap: uiTheme.spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: uiTheme.spacing.sm,
  },
  modalAction: {
    flex: 1,
  },
});
