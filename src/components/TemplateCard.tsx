import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type TemplateCardProps = {
  name: string;
  description: string;
  exerciseCount: number;
  minutes: number;
  accent: string;
  onStart: () => void;
  onEdit: () => void;
};

export const TemplateCard = ({
  name,
  description,
  exerciseCount,
  minutes,
  accent,
  onStart,
  onEdit,
}: TemplateCardProps) => (
  <View style={[styles.card, { borderColor: `${accent}55` }]}>
    <LinearGradient
      colors={[`${accent}D9`, `${accent}7A`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <Ionicons name="flash" size={17} color="#fff" />
      <Pressable onPress={onEdit} style={styles.editIconWrap}>
        <Ionicons name="pencil" size={14} color="#fff" />
      </Pressable>
    </LinearGradient>

    <View style={styles.body}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description || 'Move, breathe, and feel better.'}
      </Text>
      <Text style={styles.meta}>
        {exerciseCount} exercises - {minutes} min
      </Text>

      <Pressable style={[styles.startButton, { backgroundColor: accent }]} onPress={onStart}>
        <Text style={styles.startText}>Start</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  banner: {
    height: 64,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: theme.spacing.md,
    gap: 6,
  },
  name: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 12,
    minHeight: 30,
  },
  meta: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  startButton: {
    marginTop: 6,
    borderRadius: theme.radius.pill,
    paddingVertical: 9,
    alignItems: 'center',
  },
  startText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
});
