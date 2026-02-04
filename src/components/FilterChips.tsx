import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { titleCaseLabel } from '../ui/utils/text';

type Props<T extends string> = {
  items: T[];
  value: T | 'All';
  onChange: (value: T | 'All') => void;
};

export const FilterChips = <T extends string>({ items, value, onChange }: Props<T>) => (
  <View style={styles.row}>
    {(['All', ...items] as Array<T | 'All'>).map((item) => {
      const active = value === item;
      return (
        <Pressable
          key={item}
          onPress={() => onChange(item)}
          style={[styles.chip, active && styles.chipActive]}
        >
          <Text style={[styles.label, active && styles.labelActive]}>{titleCaseLabel(item)}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface2,
  },
  label: {
    color: theme.colors.subtext,
    fontWeight: '600',
    fontSize: 12,
  },
  labelActive: {
    color: theme.colors.primary,
  },
});
