import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';
import { titleCaseLabel } from '../ui/utils/text';

type PillChipProps = {
  label: string;
  active?: boolean;
  accent?: string;
  onPress?: () => void;
};

export const PillChip = ({ label, active = false, accent = theme.colors.primary, onPress }: PillChipProps) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.chip,
      active && {
        borderColor: accent,
        backgroundColor: `${accent}1A`,
      },
    ]}
  >
    <Text style={[styles.text, active && { color: accent }]}>{titleCaseLabel(label)}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFFE8',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  text: {
    color: theme.colors.muted,
    ...theme.typography.small,
    fontWeight: '600',
  },
});
