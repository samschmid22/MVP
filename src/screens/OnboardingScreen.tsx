import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/Buttons';
import { Screen } from '../components/Screen';
import { goalById, goalOptions } from '../data/goals';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = ({ navigation }: Props) => {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const selectedGoalFromState = useAppStore((state) => state.user.selectedGoal);
  const { width } = useWindowDimensions();
  const columns = width >= 1000 ? 3 : 2;
  const cardGap = theme.spacing.sm;
  const cardWidth = useMemo(
    () => Math.max(150, (width - theme.spacing.lg * 2 - cardGap * (columns - 1)) / columns),
    [width, columns],
  );

  const [selectedGoal, setSelectedGoal] = useState<string>(
    selectedGoalFromState && goalById[selectedGoalFromState] ? selectedGoalFromState : goalOptions[0].id,
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>What do you want to focus on?</Text>
          <Text style={styles.caption}>
            Pick one to personalize your quick starts (you can change this later).
          </Text>
        </View>

        <Card accentColor={theme.colors.accentPink}>
          <Text style={styles.disclaimerTitle}>Safety disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Not medical advice. Stop if pain. Consult a professional.
          </Text>
        </Card>

        <View style={styles.grid}>
          {goalOptions.map((goal) => {
            const active = selectedGoal === goal.id;
            const accent = theme.category[goal.focus];
            return (
              <Pressable
                key={goal.id}
                onPress={() => setSelectedGoal(goal.id)}
                style={[
                  styles.goalCard,
                  {
                    width: cardWidth,
                    backgroundColor: `${accent}14`,
                    borderColor: active ? accent : `${accent}5A`,
                  },
                  active && styles.goalCardActive,
                ]}
              >
                <View style={[styles.iconBubble, { backgroundColor: `${accent}22` }]}>
                  <Ionicons name={goal.icon as keyof typeof Ionicons.glyphMap} size={20} color={accent} />
                </View>
                <Text style={[styles.goalTitle, active && { color: accent }]}>{goal.title}</Text>
                <Text style={styles.goalDescription} numberOfLines={2}>
                  {goal.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <PrimaryButton
          label="Continue"
          onPress={() => {
            const goal = goalById[selectedGoal];
            completeOnboarding({
              selectedGoal,
              preferences: [goal.preference],
            });
            navigation.replace('MainTabs');
          }}
          style={styles.continueButton}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.md,
    paddingBottom: 56,
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  caption: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  disclaimerTitle: {
    ...theme.typography.small,
    color: theme.colors.text,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  disclaimerText: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  goalCard: {
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    minHeight: 132,
  },
  goalCardActive: {
    ...theme.shadows.soft,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    ...theme.typography.small,
    color: theme.colors.text,
    fontWeight: '600',
  },
  goalDescription: {
    ...theme.typography.small,
    color: theme.colors.muted,
    fontWeight: '500',
  },
  continueButton: {
    marginTop: theme.spacing.sm,
  },
});
