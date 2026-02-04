import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from './Buttons';
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
    colors={theme.gradients.brand}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.card}
  >
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.actions}>
        <PrimaryButton
          label={primaryLabel}
          onPress={onPrimaryPress}
          style={styles.primaryBtn}
          textStyle={styles.primaryText}
        />
        <SecondaryButton
          label={secondaryLabel}
          onPress={onSecondaryPress}
          style={styles.secondaryBtn}
          textStyle={styles.secondaryText}
        />
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
    borderRadius: theme.radii.xxl,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    minHeight: 188,
    ...theme.shadows.card,
  },
  left: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    color: '#fff',
    ...theme.typography.display,
  },
  subtitle: {
    color: '#F8FAFC',
    ...theme.typography.body,
    maxWidth: 220,
  },
  actions: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  primaryBtn: {
    alignSelf: 'flex-start',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryBtn: {
    alignSelf: 'flex-start',
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  secondaryText: {
    color: '#fff',
  },
  illustrationWrap: {
    width: 88,
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
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
