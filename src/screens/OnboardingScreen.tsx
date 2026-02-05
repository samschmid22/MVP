import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { goalById, goalOptions } from '../data/goals';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { AppText, Button, Card, PageContainer, Screen } from '../ui/components';
import { brandByCategory, uiTheme } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = ({ navigation }: Props) => {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const selectedGoalFromState = useAppStore((state) => state.user.selectedGoal);
  const { width } = useWindowDimensions();

  const columns = width >= 1024 ? 3 : 2;
  const gap = uiTheme.spacing.sm;
  const horizontalPadding = width >= 1024 ? uiTheme.spacing.xxxl : width >= 640 ? uiTheme.spacing.xxl : uiTheme.spacing.lg;
  const maxWidth = Math.min(width, 1120);
  const cardWidth = useMemo(() => {
    const available = maxWidth - horizontalPadding * 2 - gap * (columns - 1);
    return available > 0 ? available / columns : width;
  }, [columns, gap, horizontalPadding, maxWidth, width]);

  const [selectedGoal, setSelectedGoal] = useState<string>(
    selectedGoalFromState && goalById[selectedGoalFromState] ? selectedGoalFromState : goalOptions[0].id,
  );

  return (
    <Screen padded={false}>
      <PageContainer>
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
            const iconColor = selected ? uiTheme.colors.white : accent;
            return (
              <View key={goal.id} style={{ width: cardWidth }}>
                {selected ? (
                  <LinearGradient
                    colors={uiTheme.gradients.brand}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.goalBorder}
                  >
                    <Pressable
                      onPress={() => setSelectedGoal(goal.id)}
                      style={[styles.goalCard, styles.goalCardSelected]}
                    >
                      <View style={styles.goalOverlay} pointerEvents="none" />
                      <View style={styles.goalContent}>
                        <View style={[styles.goalIconWrap, styles.goalIconWrapSelected]}>
                          <Ionicons name={goal.icon as keyof typeof Ionicons.glyphMap} size={20} color={iconColor} />
                        </View>
                        <AppText variant="h3" style={styles.goalTitleSelected}>
                          {goal.title}
                        </AppText>
                        <AppText variant="caption" style={styles.goalSubtitleSelected}>
                          {goal.description}
                        </AppText>
                      </View>
                    </Pressable>
                  </LinearGradient>
                ) : (
                  <Pressable
                    onPress={() => setSelectedGoal(goal.id)}
                    style={[
                      styles.goalCard,
                      {
                        backgroundColor: tint,
                        borderColor: `${accent}5C`,
                      },
                    ]}
                  >
                    <View style={[styles.goalIconWrap, { backgroundColor: `${accent}24` }]}>
                      <Ionicons name={goal.icon as keyof typeof Ionicons.glyphMap} size={20} color={iconColor} />
                    </View>
                    <AppText variant="h3" style={styles.goalTitle}>
                      {goal.title}
                    </AppText>
                    <AppText variant="caption" style={styles.subtext}>
                      {goal.description}
                    </AppText>
                  </Pressable>
                )}
              </View>
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
      </PageContainer>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: uiTheme.spacing.sm,
    paddingBottom: uiTheme.spacing.xxxl,
    gap: uiTheme.spacing.lg,
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
    ...uiTheme.shadows.card,
  },
  goalCard: {
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    padding: uiTheme.spacing.lg,
    minHeight: 132,
    gap: uiTheme.spacing.xs,
    ...uiTheme.shadows.soft,
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  goalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: uiTheme.radius.lg,
  },
  goalContent: {
    gap: uiTheme.spacing.xs,
    zIndex: 1,
  },
  goalIconWrap: {
    width: 34,
    height: 34,
    borderRadius: uiTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalIconWrapSelected: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  goalTitle: {
    fontWeight: '600',
  },
  goalTitleSelected: {
    color: uiTheme.colors.white,
    fontWeight: '600',
  },
  goalSubtitleSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
});
