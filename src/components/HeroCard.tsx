import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type HeroCardProps = {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
};

export const HeroCard = ({
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
}: HeroCardProps) => (
  <LinearGradient
    colors={theme.gradients.hero}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.card}
  >
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.primaryBtn} onPress={onPrimaryPress}>
          <Text style={styles.primaryText}>{primaryLabel}</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={onSecondaryPress}>
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </Pressable>
      </View>
    </View>

    <View style={styles.illustrationWrap}>
      <Ionicons name="sparkles" size={18} color="#fff" style={styles.sparkleOne} />
      <Ionicons name="sparkles" size={12} color="#fff" style={styles.sparkleTwo} />
      <View style={styles.iconBubble}>
        <Ionicons name="body" size={36} color={theme.colors.text} />
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    ...theme.shadow.card,
  },
  left: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 33,
  },
  subtitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    maxWidth: 220,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryText: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 13,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  illustrationWrap: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sparkleOne: {
    position: 'absolute',
    top: 0,
    right: 8,
  },
  sparkleTwo: {
    position: 'absolute',
    top: 22,
    left: 8,
  },
  iconBubble: {
    width: 66,
    height: 66,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
