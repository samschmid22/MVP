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
import { PillChip } from '../components/PillChip';
import { Screen } from '../components/Screen';
import { useAppStore } from '../storage/appStore';
import { theme } from '../theme';
import { ExerciseCategory } from '../types/models';

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

  const listHeader = (
    <View style={styles.headerWrap}>
      <View>
        <Text style={styles.heading}>Exercise Library</Text>
        <Text style={styles.subheading}>Browse moves with visual cards and smart filters</Text>
      </View>

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
        <PillChip
          label="All"
          active={category === 'All'}
          accent={theme.colors.primary}
          onPress={() => setCategory('All')}
        />

        {categories.map((item) => {
          const active = category === item;
          const accent = theme.category[item];
          return (
            <PillChip
              key={item}
              label={item}
              active={active}
              accent={accent}
              onPress={() => setCategory(item)}
            />
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
    <Screen padded={false}>
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 110,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  headerWrap: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  heading: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  subheading: {
    marginTop: 2,
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: '#FFFFFFF0',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadow.soft,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    ...theme.typography.body,
  },
  chipsRow: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  favoriteToggle: {
    alignSelf: 'flex-start',
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFFE6',
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
    ...theme.typography.small,
    fontWeight: '600',
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
