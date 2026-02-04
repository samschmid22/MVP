import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { Screen } from '../components/Screen';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const goals: Array<'Mobility' | 'Posture' | 'Stability' | 'Balance' | 'Flexibility'> = [
  'Mobility',
  'Posture',
  'Stability',
  'Balance',
  'Flexibility',
];

const goalColor: Record<(typeof goals)[number], string> = {
  Mobility: theme.category.Mobility,
  Posture: theme.category.Posture,
  Stability: theme.category.Stability,
  Balance: theme.category.Balance,
  Flexibility: theme.colors.primary,
};

export const OnboardingScreen = ({ navigation }: Props) => {
  const userPreferences = useAppStore((state) => state.user.preferences);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const [selectedGoals, setSelectedGoals] =
    useState<typeof userPreferences>(userPreferences.length ? userPreferences : ['Mobility']);

  const toggleGoal = (goal: (typeof goals)[number]) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal],
    );
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Bend MVP</Text>
        <Text style={styles.caption}>Build your plan around how you want to feel.</Text>

        <View style={styles.disclaimerCard}>
          <View style={styles.accentBar} />
          <Text style={styles.disclaimerTitle}>Safety Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Not medical advice. Stop if pain. Consult a professional.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Pick your goals</Text>
        <View style={styles.goalWrap}>
          {goals.map((goal) => {
            const active = selectedGoals.includes(goal);
            const accent = goalColor[goal];
            return (
              <Pressable
                key={goal}
                onPress={() => toggleGoal(goal)}
                style={[
                  styles.goalChip,
                  active && { backgroundColor: `${accent}1A`, borderColor: accent },
                ]}
              >
                <Text style={[styles.goalText, active && { color: accent }]}>{goal}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={styles.button}
          onPress={() => {
            completeOnboarding(selectedGoals);
            navigation.replace('MainTabs');
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: 40, gap: 16 },
  title: { ...theme.type.h1, color: theme.colors.text },
  caption: { color: theme.colors.muted, fontSize: 14, fontWeight: '600' },
  disclaimerCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFFEC',
    padding: 16,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadow.soft,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.category.Posture,
  },
  disclaimerTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  disclaimerText: { color: theme.colors.muted, lineHeight: 20 },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  goalWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  goalChip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFFE8',
  },
  goalText: { color: theme.colors.muted, fontWeight: '700' },
  button: {
    marginTop: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
    ...theme.shadow.card,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
