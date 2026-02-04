import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { uiTheme } from '../theme';
import { titleCaseLabel } from '../utils/text';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const Chip = ({ label, selected = false, onPress, style }: ChipProps) => (
  <Pressable onPress={onPress} style={[styles.chip, selected && styles.selectedChip, style]}>
    <AppText variant="caption" style={[styles.label, selected && styles.selectedLabel]}>
      {titleCaseLabel(label)}
    </AppText>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    borderRadius: uiTheme.radius.pill,
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    backgroundColor: uiTheme.colors.surface,
    paddingHorizontal: uiTheme.spacing.md,
    paddingVertical: uiTheme.spacing.sm,
  },
  selectedChip: {
    borderColor: uiTheme.colors.brandPurple,
    backgroundColor: uiTheme.colors.surface2,
  },
  label: {
    color: uiTheme.colors.muted,
    textDecorationLine: 'none',
  },
  selectedLabel: {
    color: uiTheme.colors.brandPurple,
    fontWeight: '600',
  },
});
