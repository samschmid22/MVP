import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

type FocusValue = 'All' | 'Mobility' | 'Posture' | 'Stability' | 'Balance';

type FocusChipsProps = {
  value: FocusValue;
  onChange: (value: FocusValue) => void;
};

const options: FocusValue[] = ['All', 'Mobility', 'Posture', 'Stability', 'Balance'];

const getAccent = (value: FocusValue) => {
  if (value === 'Mobility') return theme.category.Mobility;
  if (value === 'Posture') return theme.category.Posture;
  if (value === 'Stability') return theme.category.Stability;
  if (value === 'Balance') return theme.category.Balance;
  return theme.colors.primary;
};

export const FocusChips = ({ value, onChange }: FocusChipsProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
    {options.map((option) => {
      const active = option === value;
      const accent = getAccent(option);
      return (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={[
            styles.chip,
            active && { borderColor: accent, backgroundColor: `${accent}1A` },
          ]}
        >
          <Text style={[styles.label, active && { color: accent }]}>{option}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
  chip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFFE8',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
});
