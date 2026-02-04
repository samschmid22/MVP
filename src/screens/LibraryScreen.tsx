import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseCard } from '../components/ExerciseCard';
import { FilterChips } from '../components/FilterChips';
import { EmptyState } from '../components/EmptyState';
import { ExerciseCategory } from '../types/models';
import { useAppStore } from '../storage/appStore';
import { colors } from '../utils/theme';

const categories: ExerciseCategory[] = [
  'Mobility',
  'Posture',
  'Stability',
  'Balance',
  'Warmup',
  'Cooldown',
];

export const LibraryScreen = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | 'All'>('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const exercises = useAppStore((state) => state.exercises);
  const favoriteExerciseIds = useAppStore((state) => state.user.favoriteExerciseIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  const filtered = useMemo(() => {
    return exercises.filter((exercise) => {
      const hitsSearch =
        exercise.name.toLowerCase().includes(search.toLowerCase()) ||
        exercise.tags.join(' ').toLowerCase().includes(search.toLowerCase());
      const hitsCategory = category === 'All' || exercise.category === category;
      const hitsFavorite = !favoritesOnly || favoriteExerciseIds.includes(exercise.id);
      return hitsSearch && hitsCategory && hitsFavorite;
    });
  }, [category, exercises, favoriteExerciseIds, favoritesOnly, search]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Exercise Library</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        placeholder="Search exercises or tags"
        placeholderTextColor="#94a3b8"
      />

      <FilterChips items={categories} value={category} onChange={setCategory} />

      <Pressable
        style={[styles.favoriteToggle, favoritesOnly && styles.favoriteToggleActive]}
        onPress={() => setFavoritesOnly((v) => !v)}
      >
        <Text style={[styles.favoriteToggleText, favoritesOnly && styles.favoriteToggleTextActive]}>
          Favorites only
        </Text>
      </Pressable>

      {filtered.length === 0 ? (
        <EmptyState title="No exercises found" subtitle="Try another search or filter." />
      ) : (
        filtered.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isFavorite={favoriteExerciseIds.includes(exercise.id)}
            onToggleFavorite={() => toggleFavorite(exercise.id)}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  favoriteToggle: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  favoriteToggleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  favoriteToggleText: { color: colors.subtext, fontWeight: '700' },
  favoriteToggleTextActive: { color: colors.primary },
});
