import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Exercise } from '../types/models';
import { getPastelByCategory, theme } from '../theme';
import { titleCaseLabel } from '../ui/utils/text';

type Props = {
  exercise: Exercise;
  isFavorite: boolean;
  onPress?: () => void;
  onToggleFavorite: () => void;
};

const ExerciseThumb = ({ name, category }: { name: string; category: Exercise['category'] }) => {
  const pastel = getPastelByCategory(category);
  const gradient = [pastel, '#FFFFFF'] as const;
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumb}>
      <View style={styles.dot} />
      <View style={styles.dotTwo} />
      <View style={styles.blob} />
      <Ionicons name="accessibility" size={27} color={theme.colors.text} style={styles.poseIcon} />
      <Text style={styles.initials}>{initials}</Text>
    </LinearGradient>
  );
};

export const ExerciseCard = ({ exercise, isFavorite, onPress, onToggleFavorite }: Props) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    onPress={onPress}
  >
    <View style={[styles.accentBar, { backgroundColor: theme.category[exercise.category] }]} />
    <ExerciseThumb name={exercise.name} category={exercise.category} />
    <Pressable onPress={onToggleFavorite} hitSlop={8} style={styles.favoriteButton}>
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={20}
        color={isFavorite ? theme.colors.accentPink : theme.colors.muted}
      />
    </Pressable>

    <Text style={styles.title} numberOfLines={2}>
      {exercise.name}
    </Text>

    <Text style={styles.duration}>{exercise.defaultDurationSec}s</Text>

    <View style={styles.tagRow}>
      {exercise.tags.slice(0, 2).map((tag) => (
        <View key={tag} style={styles.tagChip}>
          <Text style={styles.tagText}>{titleCaseLabel(tag)}</Text>
        </View>
      ))}
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.card,
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  thumb: {
    height: 102,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    position: 'absolute',
    top: -12,
    right: -6,
  },
  dotTwo: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
    position: 'absolute',
    top: 18,
    right: 42,
  },
  blob: {
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  poseIcon: {
    position: 'absolute',
    top: 34,
  },
  initials: {
    position: 'absolute',
    bottom: 9,
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  favoriteButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: 'rgba(255,255,255,0.64)',
    borderWidth: 1,
    borderColor: '#FFFFFF8A',
    borderRadius: theme.radii.pill,
    padding: 5,
  },
  title: {
    ...theme.typography.small,
    fontWeight: '600',
    color: theme.colors.text,
    minHeight: 36,
  },
  duration: {
    ...theme.typography.small,
    color: theme.colors.primary,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: theme.colors.tintBlue,
    borderRadius: theme.radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    ...theme.typography.micro,
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
});
