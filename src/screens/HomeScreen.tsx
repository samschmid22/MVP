import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { colors } from '../utils/theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const workouts = useAppStore((state) => state.workouts);
  const lastWorkoutId = useAppStore((state) => state.lastWorkoutId);

  const lastWorkout = workouts.find((w) => w.id === lastWorkoutId) ?? null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Home</Text>

      {lastWorkout ? (
        <Pressable
          style={styles.heroCard}
          onPress={() => navigation.navigate('Player', { workoutId: lastWorkout.id })}
        >
          <Text style={styles.heroLabel}>Continue last workout</Text>
          <Text style={styles.heroTitle}>{lastWorkout.name}</Text>
          <Text style={styles.heroCta}>Resume session</Text>
        </Pressable>
      ) : (
        <EmptyState
          title="No active workout"
          subtitle="Start one of the templates below or build your own."
        />
      )}

      <View style={styles.rowHeader}>
        <Text style={styles.section}>Quick start templates</Text>
        <Pressable onPress={() => navigation.navigate('WorkoutBuilder')}>
          <Text style={styles.link}>+ Build</Text>
        </Pressable>
      </View>

      {workouts.map((workout) => (
        <View key={workout.id} style={styles.workoutCard}>
          <View style={styles.workoutTextWrap}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            <Text style={styles.workoutDesc}>{workout.description}</Text>
          </View>
          <View style={styles.workoutActions}>
            <Pressable
              style={styles.miniButton}
              onPress={() => navigation.navigate('WorkoutBuilder', { workoutId: workout.id })}
            >
              <Text style={styles.miniButtonText}>Edit</Text>
            </Pressable>
            <Pressable
              style={[styles.miniButton, styles.startButton]}
              onPress={() => navigation.navigate('Player', { workoutId: workout.id })}
            >
              <Text style={[styles.miniButtonText, styles.startButtonText]}>Start</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable style={styles.premiumCta} onPress={() => navigation.navigate('Premium')}>
        <Text style={styles.premiumCtaText}>Premium: Type any exercise name -> cartoon animation</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
  heroCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.primary,
    gap: 8,
  },
  heroLabel: { color: '#d1fae5', fontWeight: '600' },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  heroCta: { color: '#fff', fontWeight: '700' },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { fontSize: 18, fontWeight: '700', color: colors.text },
  link: { color: colors.primary, fontWeight: '700' },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 10,
  },
  workoutTextWrap: { gap: 4 },
  workoutTitle: { fontWeight: '700', fontSize: 16, color: colors.text },
  workoutDesc: { color: colors.subtext },
  workoutActions: { flexDirection: 'row', gap: 8 },
  miniButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  miniButtonText: { color: colors.subtext, fontWeight: '600' },
  startButton: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  startButtonText: { color: colors.primary },
  premiumCta: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#111827',
    padding: 14,
  },
  premiumCtaText: { color: '#fff', fontWeight: '700' },
});
