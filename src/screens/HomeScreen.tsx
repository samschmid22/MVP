import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoalFocus, goalById } from '../data/goals';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { AppText, Button, Card, Chip, PageContainer, Screen, getFloatingTabBarPadding } from '../ui/components';
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
  const isWide = width >= 900;
  const isTemplateGridWide = width >= 768;

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

  return (
    <Screen padded={false}>
      <PageContainer>
        <View style={[styles.pageStack, { paddingBottom: getFloatingTabBarPadding(insets.bottom) }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <AppText variant="h1">Start a session</AppText>
              <AppText variant="body" style={styles.subtitle} numberOfLines={1}>
                Choose a routine or build one.
              </AppText>
            </View>
            <LinearGradient colors={uiTheme.gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroBadge}>
              <Ionicons name="sparkles-outline" size={18} color={uiTheme.colors.white} />
            </LinearGradient>
          </View>

          <View style={styles.ctaRow}>
            <Button label="Start session" variant="primary" onPress={handleStartWorkout} />
            <Button label="Build workout" variant="secondary" onPress={() => navigation.navigate('WorkoutBuilder')} />
          </View>

          <View style={[styles.gridRow, isWide && styles.gridRowWide]}>
            <Card style={styles.sectionSurface}>
              <View style={styles.cardHeaderRow}>
                <AppText variant="h3">Current session</AppText>
                <View style={styles.statusBadge}>
                  <AppText variant="caption" style={styles.statusText}>
                    {lastWorkout ? 'In progress' : 'Not started'}
                  </AppText>
                </View>
              </View>
              {lastWorkout ? (
                <View style={styles.currentDetail}>
                  <AppText variant="body">{lastWorkout.name}</AppText>
                  <AppText variant="caption" style={styles.mutedText} numberOfLines={1}>
                    {metaByWorkoutId[lastWorkout.id]?.firstExerciseName} • {metaByWorkoutId[lastWorkout.id]?.minutes ?? 1} min
                  </AppText>
                </View>
              ) : (
                <AppText variant="caption" style={styles.mutedText}>
                  No session in progress.
                </AppText>
              )}
              <Button
                label={lastWorkout ? 'Resume session' : 'Start session'}
                variant="secondary"
                onPress={() =>
                  lastWorkout
                    ? navigation.navigate('Player', { workoutId: lastWorkout.id })
                    : handleStartWorkout()
                }
              />
            </Card>

            <Card style={styles.sectionSurface}>
              <View style={styles.quickHeader}>
                <AppText variant="h3">Quick start</AppText>
                <AppText variant="caption" style={styles.mutedText} numberOfLines={1}>
                  Pick a focus and choose a template.
                </AppText>
              </View>

              <View style={styles.chipsRow}>
                {(['All', 'Mobility', 'Posture', 'Stability', 'Balance'] as GoalFocus[]).map((item) => (
                  <Chip key={item} label={item} selected={focus === item} onPress={() => setFocus(item)} />
                ))}
              </View>

              <Pressable onPress={() => setPremiumModalVisible(true)} style={styles.premiumBanner}>
                <Ionicons name="sparkles-outline" size={16} color={uiTheme.colors.brandPurple} />
                <AppText variant="caption" style={styles.premiumText}>
                  Generate an exercise cue card (Premium)
                </AppText>
              </Pressable>

              <View style={styles.templateGrid}>
                {filteredTemplates.length === 0 ? (
                  <AppText variant="caption" style={styles.mutedText}>
                    No routines for this filter.
                  </AppText>
                ) : (
                  filteredTemplates.map((item) => {
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
                      <Pressable
                        key={item.id}
                        onPress={() => navigation.navigate('Player', { workoutId: item.id })}
                        style={({ pressed }) => [
                          { width: isTemplateGridWide ? '48%' : '100%' },
                          pressed && styles.templateTilePressed,
                        ]}
                      >
                        <Card style={styles.templateTile}>
                          <View style={[styles.templateIcon, { backgroundColor: `${accent}20` }]}>
                            <Ionicons name="body-outline" size={16} color={accent} />
                          </View>
                          <View style={styles.templateText}>
                            <AppText variant="body" numberOfLines={1}>
                              {item.name}
                            </AppText>
                            <AppText variant="caption" style={styles.mutedText} numberOfLines={1}>
                              {metaByWorkoutId[item.id]?.itemCount ?? 0} exercises • {metaByWorkoutId[item.id]?.minutes ?? 1} min
                            </AppText>
                          </View>
                        </Card>
                      </Pressable>
                    );
                  })
                )}
              </View>
            </Card>
          </View>
        </View>
      </PageContainer>

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
    </Screen>
  );
};

const styles = StyleSheet.create({
  pageStack: {
    gap: uiTheme.spacing.xxl,
  },
  sectionSurface: {
    backgroundColor: uiTheme.colors.surfaceAlt,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: uiTheme.spacing.lg,
  },
  headerText: {
    flex: 1,
    gap: uiTheme.spacing.xs,
  },
  subtitle: {
    color: uiTheme.colors.muted,
    maxWidth: 520,
  },
  heroBadge: {
    width: 38,
    height: 38,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...uiTheme.shadows.soft,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: uiTheme.spacing.md,
  },
  gridRow: {
    flexDirection: 'column',
    gap: uiTheme.spacing.lg,
  },
  gridRowWide: {
    flexDirection: 'row',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: uiTheme.spacing.md,
  },
  upperMuted: {
    color: uiTheme.colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: uiTheme.spacing.sm,
    paddingVertical: uiTheme.spacing.xs,
    borderRadius: uiTheme.radius.pill,
    backgroundColor: uiTheme.colors.surface,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
  },
  statusText: {
    color: uiTheme.colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  mutedText: {
    color: uiTheme.colors.muted,
  },
  currentDetail: {
    gap: uiTheme.spacing.xs,
    marginBottom: uiTheme.spacing.md,
  },
  quickHeader: {
    gap: uiTheme.spacing.xs,
    marginBottom: uiTheme.spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: uiTheme.spacing.sm,
    marginBottom: uiTheme.spacing.md,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.sm,
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    backgroundColor: uiTheme.colors.surface,
    paddingVertical: uiTheme.spacing.sm,
    paddingHorizontal: uiTheme.spacing.md,
    marginBottom: uiTheme.spacing.md,
  },
  premiumText: {
    color: uiTheme.colors.subtext,
    fontWeight: '600',
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: uiTheme.spacing.sm,
  },
  templateIcon: {
    width: 36,
    height: 36,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateTile: {
    gap: uiTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateTilePressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  templateText: {
    flex: 1,
    gap: uiTheme.spacing.xs,
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
