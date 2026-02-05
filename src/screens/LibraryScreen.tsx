import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../storage/appStore';
import { Exercise, ExerciseCategory } from '../types/models';
import { getAnimationKeyForExercise } from '../config/exerciseAnimationMap';
import { AppText, Button, Card, Chip, ExerciseAnimation, PageContainer, Screen, SectionHeader, getFloatingTabBarPadding } from '../ui/components';
import { uiTheme } from '../ui/theme';

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
  const insets = useSafeAreaInsets();
  const columns = width >= 980 ? 3 : 2;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | ExerciseCategory>('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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

  const getCardTint = (exerciseCategory: ExerciseCategory) => {
    switch (exerciseCategory) {
      case 'Mobility':
      case 'Balance':
        return uiTheme.colors.tintBlue;
      case 'Stability':
      case 'Warmup':
        return uiTheme.colors.tintPurple;
      case 'Posture':
      case 'Cooldown':
        return uiTheme.colors.tintPink;
      default:
        return uiTheme.colors.card;
    }
  };

  return (
    <Screen padded={false}>
      <PageContainer>
        <FlatList
          data={filtered}
          key={String(columns)}
          numColumns={columns}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={columns > 1 ? styles.columnRow : undefined}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          contentContainerStyle={[styles.content, { paddingBottom: getFloatingTabBarPadding(insets.bottom) + uiTheme.spacing.lg }]}
          ListHeaderComponent={
            <View style={styles.header}>
              <SectionHeader title="Exercise Library" subtitle="Search, filter, and save favorites." />
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
              <View style={styles.chipsRow}>
                {categories.map((item) => (
                  <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
                ))}
              </View>
              <Button
                label={favoritesOnly ? 'Favorites only' : 'Show favorites'}
                variant={favoritesOnly ? 'outline' : 'secondary'}
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
            const animationKey = getAnimationKeyForExercise(item);
            const cardTint = getCardTint(item.category);
            const isFavorite = favoriteExerciseIds.includes(item.id);
            return (
              <Pressable
                style={({ pressed }) => [styles.exerciseCardPressable, pressed && styles.exerciseCardPressed]}
                onPress={() => setSelectedExercise(item)}
              >
                <Card style={[styles.exerciseCard, { backgroundColor: cardTint }]}>
                  <View style={styles.cardHeader}>
                    <ExerciseAnimation animationKey={animationKey} size="card" />
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      hitSlop={8}
                      style={styles.heartButton}
                    >
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
              </Pressable>
            );
          }}
        />
      </PageContainer>
      <Modal
        animationType="slide"
        transparent
        visible={Boolean(selectedExercise)}
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalCard}>
            <AppText variant="h3">{selectedExercise?.name ?? 'Exercise Detail'}</AppText>
            <AppText variant="body" style={styles.mutedText}>
              Detailed coaching and progression options are coming soon.
            </AppText>
            <AppText variant="caption" style={styles.mutedText}>
              {selectedExercise ? `${selectedExercise.defaultDurationSec}s • ${selectedExercise.difficulty}` : ''}
            </AppText>
            <View style={styles.modalActions}>
              <Button label="Close" variant="ghost" onPress={() => setSelectedExercise(null)} style={styles.modalAction} />
              <Button
                label="Add to Workout"
                variant="primary"
                onPress={() => {
                  setSelectedExercise(null);
                  Alert.alert('Coming soon', 'Adding from the detail modal will be available soon.');
                }}
                style={styles.modalAction}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingTop: uiTheme.spacing.sm,
    gap: uiTheme.spacing.md,
  },
  header: {
    gap: uiTheme.spacing.lg,
    marginBottom: uiTheme.spacing.md,
  },
  searchWrap: {
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    backgroundColor: uiTheme.colors.surfaceAlt,
    paddingHorizontal: uiTheme.spacing.lg,
    paddingVertical: uiTheme.spacing.md,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: uiTheme.spacing.sm,
  },
  favoritesButton: {
    alignSelf: 'flex-start',
  },
  columnRow: {
    gap: uiTheme.spacing.md,
  },
  exerciseCard: {
    gap: uiTheme.spacing.sm,
  },
  exerciseCardPressable: {
    flex: 1,
    marginBottom: uiTheme.spacing.md,
    gap: uiTheme.spacing.sm,
  },
  exerciseCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.985 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heartButton: {
    width: 32,
    height: 32,
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
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: uiTheme.spacing.lg,
    paddingBottom: uiTheme.spacing.xl,
    backgroundColor: 'rgba(11,15,24,0.2)',
  },
  modalCard: {
    gap: uiTheme.spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: uiTheme.spacing.sm,
  },
  modalAction: {
    flex: 1,
  },
});
