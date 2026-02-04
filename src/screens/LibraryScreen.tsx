import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useAppStore } from '../storage/appStore';
import { ExerciseCategory } from '../types/models';
import { AppText, Button, Card, Chip, Screen, SectionHeader } from '../ui/components';
import { brandByCategory, uiTheme } from '../ui/theme';

const categories: Array<'All' | ExerciseCategory> = [
  'All',
  'Mobility',
  'Posture',
  'Stability',
  'Balance',
  'Warmup',
  'Cooldown',
];

export const LibraryScreen = () => {
  const { width } = useWindowDimensions();
  const columns = width >= 980 ? 3 : 2;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | ExerciseCategory>('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const exercises = useAppStore((state) => state.exercises);
  const favoriteExerciseIds = useAppStore((state) => state.user.favoriteExerciseIds);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  const filtered = useMemo(
    () =>
      exercises.filter((exercise) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          exercise.name.toLowerCase().includes(query) ||
          exercise.tags.join(' ').toLowerCase().includes(query);
        const matchesCategory = category === 'All' || exercise.category === category;
        const matchesFavorites = !favoritesOnly || favoriteExerciseIds.includes(exercise.id);
        return matchesSearch && matchesCategory && matchesFavorites;
      }),
    [category, exercises, favoriteExerciseIds, favoritesOnly, search],
  );

  return (
    <Screen>
      <View pointerEvents="none" style={styles.washWrap}>
        <LinearGradient colors={uiTheme.gradients.wash} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.6 }} style={styles.wash} />
      </View>

      <FlatList
        data={filtered}
        key={String(columns)}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={columns > 1 ? styles.columnRow : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <SectionHeader title="Exercise Library" subtitle="Browse moves with quick filters and favorites." />
            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={uiTheme.colors.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholder="Search exercises or tags"
                placeholderTextColor={uiTheme.colors.muted}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {categories.map((item) => (
                <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
              ))}
            </ScrollView>
            <Button
              label={favoritesOnly ? 'Favorites only' : 'Show favorites'}
              variant={favoritesOnly ? 'secondary' : 'ghost'}
              onPress={() => setFavoritesOnly((prev) => !prev)}
              icon={
                <Ionicons
                  name={favoritesOnly ? 'heart' : 'heart-outline'}
                  size={16}
                  color={favoritesOnly ? uiTheme.colors.brandPink : uiTheme.colors.muted}
                />
              }
              style={styles.favoritesButton}
            />
          </View>
        }
        ListEmptyComponent={
          <Card>
            <AppText variant="h3">No exercises found</AppText>
            <AppText variant="caption" style={styles.mutedText}>
              Try another search or reset filters.
            </AppText>
          </Card>
        }
        renderItem={({ item }) => {
          const accent = brandByCategory[item.category];
          const isFavorite = favoriteExerciseIds.includes(item.id);
          return (
            <Card style={styles.exerciseCard}>
              <LinearGradient colors={uiTheme.gradients.brandSoft} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardTop} />
              <View style={styles.cardHeader}>
                <View style={[styles.cardThumb, { backgroundColor: `${accent}20` }]}>
                  <Ionicons name="accessibility-outline" size={20} color={accent} />
                </View>
                <Pressable onPress={() => toggleFavorite(item.id)} hitSlop={8} style={styles.heartButton}>
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isFavorite ? uiTheme.colors.brandPink : uiTheme.colors.muted}
                  />
                </Pressable>
              </View>
              <AppText variant="h3" numberOfLines={2}>
                {item.name}
              </AppText>
              <AppText variant="caption" style={styles.mutedText}>
                {item.defaultDurationSec}s • {item.difficulty}
              </AppText>
              <View style={styles.tags}>
                {item.tags.slice(0, 2).map((tag) => (
                  <Chip key={tag} label={tag} style={styles.tagChip} />
                ))}
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  washWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    opacity: 0.08,
  },
  wash: {
    flex: 1,
  },
  content: {
    paddingTop: uiTheme.spacing.sm,
    paddingBottom: 118,
    gap: uiTheme.spacing.sm,
  },
  header: {
    gap: uiTheme.spacing.md,
    marginBottom: uiTheme.spacing.sm,
  },
  searchWrap: {
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    backgroundColor: uiTheme.colors.surface,
    paddingHorizontal: uiTheme.spacing.md,
    paddingVertical: uiTheme.spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.sm,
    ...uiTheme.shadows.soft,
  },
  searchInput: {
    flex: 1,
    color: uiTheme.colors.text,
    ...uiTheme.typography.body,
  },
  chipsRow: {
    gap: uiTheme.spacing.sm,
    paddingRight: uiTheme.spacing.sm,
  },
  favoritesButton: {
    alignSelf: 'flex-start',
  },
  columnRow: {
    gap: uiTheme.spacing.sm,
  },
  exerciseCard: {
    flex: 1,
    marginBottom: uiTheme.spacing.sm,
    gap: uiTheme.spacing.sm,
  },
  cardTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  cardHeader: {
    marginTop: uiTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardThumb: {
    width: 44,
    height: 44,
    borderRadius: uiTheme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    width: 30,
    height: 30,
    borderRadius: uiTheme.radius.pill,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: uiTheme.colors.surface,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: uiTheme.spacing.xs,
  },
  tagChip: {
    paddingHorizontal: uiTheme.spacing.sm,
    paddingVertical: uiTheme.spacing.xs,
  },
  mutedText: {
    color: uiTheme.colors.muted,
  },
});
