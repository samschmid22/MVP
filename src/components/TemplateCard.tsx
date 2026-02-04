import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { PrimaryButton } from './Buttons';
import { theme } from '../theme';

type TemplateCardProps = {
  name: string;
  description: string;
  exerciseCount: number;
  minutes: number;
  accent: string;
  onStart: () => void;
  onEdit: () => void;
  style?: StyleProp<ViewStyle>;
};

export const TemplateCard = ({
  name,
  description,
  exerciseCount,
  minutes,
  accent,
  onStart,
  onEdit,
  style,
}: TemplateCardProps) => (
  <View style={[styles.card, { borderColor: `${accent}3D` }, style]}>
    <LinearGradient
      colors={[`${accent}C2`, `${accent}7A`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.banner}
    >
      <View style={styles.bannerIcon}>
        <Ionicons name="body-outline" size={18} color="#FFFFFF" />
      </View>
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
        {exerciseCount} exercises • {minutes} min
      </Text>

      <PrimaryButton label="Start" onPress={onStart} style={styles.startButton} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    minHeight: 220,
    ...theme.shadows.soft,
  },
  banner: {
    height: 78,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    ...theme.typography.h2,
    fontSize: 17,
    lineHeight: 22,
  },
  description: {
    color: theme.colors.muted,
    ...theme.typography.small,
    minHeight: 36,
  },
  meta: {
    color: theme.colors.text,
    ...theme.typography.small,
    fontWeight: '600',
  },
  startButton: {
    marginTop: 'auto',
  },
});
