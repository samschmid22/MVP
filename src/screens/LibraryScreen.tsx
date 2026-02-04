import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ExerciseCard } from '../components/ExerciseCard';
import { useAppStore } from '../storage/appStore';
import { ExerciseCategory } from '../types/models';
import { theme } from '../theme';

const categories: ExerciseCategory[] = [
  'Mobility',
  'Posture',
  'Stability',
  'Balance',
  'Warmup',
  'Cooldown',
];

const categoryColor: Record<ExerciseCategory, string> = {
  Mobility: '#3B82F6',
  Posture: '#EC4899',
  Stability: '#FBBF24',
  Balance: '#3B82F6',
  Warmup: '#EC4899',
  Cooldown: '#FBBF24',
};

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

  const listHeader = (
    <View style={styles.headerWrap}>
      <Text style={styles.heading}>Exercise Library</Text>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={theme.colors.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholder="Search exercises or tags"
          placeholderTextColor="#94A3B8"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        <Pressable
          onPress={() => setCategory('All')}
          style={[styles.categoryChip, category === 'All' && styles.categoryChipActive, { borderColor: '#CBD5E1' }]}
        >
          <Text
            style={[
              styles.categoryText,
              category === 'All' && { color: theme.colors.primary },
            ]}
          >
            All
          </Text>
        </Pressable>

        {categories.map((item) => {
          const active = category === item;
          const accent = categoryColor[item];
          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.categoryChip,
                active && { backgroundColor: `${accent}1A`, borderColor: accent },
              ]}
            >
              <Text style={[styles.categoryText, active && { color: accent }]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        style={[styles.favoriteToggle, favoritesOnly && styles.favoriteToggleActive]}
        onPress={() => setFavoritesOnly((value) => !value)}
      >
        <Ionicons
          name={favoritesOnly ? 'heart' : 'heart-outline'}
          size={16}
          color={favoritesOnly ? theme.colors.accentPink : theme.colors.muted}
        />
        <Text style={[styles.favoriteText, favoritesOnly && styles.favoriteTextActive]}>Favorites only</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {filtered.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          {listHeader}
          <EmptyState title="No exercises found" subtitle="Try another search or filter." />
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              isFavorite={favoriteExerciseIds.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 110,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  headerWrap: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  heading: {
    ...theme.type.h1,
    color: theme.colors.text,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadow.card,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  chipsRow: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  categoryChip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: '#DBEAFE',
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  favoriteToggle: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favoriteToggleActive: {
    borderColor: theme.colors.accentPink,
    backgroundColor: '#FCE7F3',
  },
  favoriteText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.muted,
  },
  favoriteTextActive: {
    color: theme.colors.accentPink,
  },
  columnRow: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
});
