import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { goalById, goalOptions } from '../data/goals';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { AppText, Button, Card, Screen } from '../ui/components';
import { brandByCategory, uiTheme } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = ({ navigation }: Props) => {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const selectedGoalFromState = useAppStore((state) => state.user.selectedGoal);
  const { width } = useWindowDimensions();

  const columns = width >= 1024 ? 3 : width >= 720 ? 2 : 1;
  const gap = uiTheme.spacing.sm;
  const cardWidth = useMemo(
    () => (width - uiTheme.spacing.lg * 2 - gap * (columns - 1)) / columns,
    [columns, gap, width],
  );

  const [selectedGoal, setSelectedGoal] = useState<string>(
    selectedGoalFromState && goalById[selectedGoalFromState] ? selectedGoalFromState : goalOptions[0].id,
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="h1">What do you want to focus on?</AppText>
          <AppText variant="body" style={styles.subtext}>
            Pick one to personalize your quick starts (you can change this later).
          </AppText>
        </View>

        <Card accent>
          <AppText variant="caption" style={styles.disclaimerTitle}>
            Safety
          </AppText>
          <AppText variant="body" style={styles.subtext}>
            Not medical advice. Stop if pain. Consult a professional.
          </AppText>
        </Card>

        <View style={styles.grid}>
          {goalOptions.map((goal) => {
            const selected = selectedGoal === goal.id;
            const accent = brandByCategory[goal.focus];
            const tint = `${accent}14`;

            const goalCard = (
              <Pressable
                key={selected ? `${goal.id}_selected` : goal.id}
                onPress={() => setSelectedGoal(goal.id)}
                style={[
                  styles.goalCard,
                  {
                    width: cardWidth,
                    backgroundColor: tint,
                    borderColor: `${accent}5C`,
                  },
                ]}
              >
                <View style={[styles.goalIconWrap, { backgroundColor: `${accent}24` }]}>
                  <Ionicons name={goal.icon as keyof typeof Ionicons.glyphMap} size={20} color={accent} />
                </View>
                <AppText variant="h3" style={[styles.goalTitle, { color: selected ? accent : uiTheme.colors.text }]}>
                  {goal.title}
                </AppText>
                <AppText variant="caption" style={styles.subtext}>
                  {goal.description}
                </AppText>
              </Pressable>
            );

            if (!selected) return goalCard;

            return (
              <LinearGradient
                key={goal.id}
                colors={uiTheme.gradients.brand}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.goalBorder, { width: cardWidth }]}
              >
                {goalCard}
              </LinearGradient>
            );
          })}
        </View>

        <Button
          label="Continue"
          variant="primary"
          onPress={() => {
            const goal = goalById[selectedGoal];
            completeOnboarding({
              selectedGoal,
              preferences: [goal.preference],
            });
            navigation.replace('MainTabs');
          }}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: uiTheme.spacing.md,
    paddingBottom: 48,
    gap: uiTheme.spacing.md,
  },
  header: {
    gap: uiTheme.spacing.xs,
  },
  subtext: {
    color: uiTheme.colors.muted,
  },
  disclaimerTitle: {
    color: uiTheme.colors.brandPurple,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: uiTheme.spacing.sm,
  },
  goalBorder: {
    borderRadius: uiTheme.radius.lg,
    padding: 1.5,
  },
  goalCard: {
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    padding: uiTheme.spacing.md,
    minHeight: 132,
    gap: uiTheme.spacing.xs,
    ...uiTheme.shadows.soft,
  },
  goalIconWrap: {
    width: 34,
    height: 34,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontWeight: '600',
  },
});
