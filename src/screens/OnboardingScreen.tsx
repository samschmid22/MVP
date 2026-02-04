import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const goals: Array<'Mobility' | 'Posture' | 'Stability' | 'Balance' | 'Flexibility'> = [
  'Mobility',
  'Posture',
  'Stability',
  'Balance',
  'Flexibility',
];

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Bend MVP</Text>
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Safety Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Not medical advice. Stop if pain. Consult a professional.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Pick your goals</Text>
        <View style={styles.goalWrap}>
          {goals.map((goal) => {
            const active = selectedGoals.includes(goal);
            return (
              <Pressable
                key={goal}
                onPress={() => toggleGoal(goal)}
                style={[styles.goalChip, active && styles.goalChipActive]}
              >
                <Text style={[styles.goalText, active && styles.goalTextActive]}>{goal}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 20, justifyContent: 'center', gap: 18 },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  disclaimerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    padding: 16,
    gap: 8,
  },
  disclaimerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  disclaimerText: { color: colors.subtext, lineHeight: 20 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  goalWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  goalChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  goalChipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  goalText: { color: colors.subtext, fontWeight: '600' },
  goalTextActive: { color: colors.primary },
  button: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 14,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
