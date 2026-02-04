import { ScrollView, StyleSheet } from 'react-native';
import { PillChip } from './PillChip';
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
        <PillChip
          key={option}
          label={option}
          active={active}
          accent={accent}
          onPress={() => onChange(option)}
        />
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
  },
});
