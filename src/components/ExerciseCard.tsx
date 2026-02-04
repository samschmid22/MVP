import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Exercise } from '../types/models';
import { colors } from '../utils/theme';

type Props = {
  exercise: Exercise;
  isFavorite: boolean;
  onPress?: () => void;
  onToggleFavorite: () => void;
};

export const ExerciseCard = ({ exercise, isFavorite, onPress, onToggleFavorite }: Props) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.header}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Pressable onPress={onToggleFavorite} hitSlop={8}>
        <Text style={styles.favorite}>{isFavorite ? '*' : 'o'}</Text>
      </Pressable>
    </View>
    <Text style={styles.meta}>
      {exercise.category} - {exercise.difficulty} - {exercise.defaultDurationSec}s
    </Text>
    <Text style={styles.tags}>{exercise.tags.join(' - ')}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    paddingRight: 8,
  },
  favorite: {
    color: colors.accent,
    fontSize: 22,
  },
  meta: {
    color: colors.subtext,
    fontSize: 12,
  },
  tags: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
