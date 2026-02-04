import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

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
          <Text style={[styles.label, active && styles.labelActive]}>{item}</Text>
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
    borderColor: colors.border,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  label: {
    color: colors.subtext,
    fontWeight: '600',
    fontSize: 12,
  },
  labelActive: {
    color: colors.primary,
  },
});
