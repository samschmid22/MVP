import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Exercise } from '../types/models';
import { theme } from '../theme';

type Props = {
  exercise: Exercise;
  isFavorite: boolean;
  onPress?: () => void;
  onToggleFavorite: () => void;
};

const cardPalette = ['#DBEAFE', '#FCE7F3', '#FEF3C7'];

const ExerciseThumb = ({ name, id }: { name: string; id: string }) => {
  const color = cardPalette[id.charCodeAt(id.length - 1) % cardPalette.length];
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View style={[styles.thumb, { backgroundColor: color }]}> 
      <View style={styles.blob} />
      <Ionicons name="accessibility" size={26} color={theme.colors.text} style={styles.poseIcon} />
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

export const ExerciseCard = ({ exercise, isFavorite, onPress, onToggleFavorite }: Props) => (
  <Pressable style={styles.card} onPress={onPress}>
    <ExerciseThumb name={exercise.name} id={exercise.id} />
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
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadow.card,
  },
  thumb: {
    height: 108,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blob: {
    width: 92,
    height: 92,
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
    right: 10,
    top: 10,
    backgroundColor: '#FFFFFFD9',
    borderRadius: theme.radius.pill,
    padding: 5,
  },
  title: {
    ...theme.type.title,
    color: theme.colors.text,
    minHeight: 40,
  },
  duration: {
    ...theme.type.caption,
    color: theme.colors.primary,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: '#EEF2FF',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'capitalize',
  },
});
