import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    {selected ? (
      <LinearGradient
        colors={uiTheme.gradients.wash}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.selectedFill}
      />
    ) : null}
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
    backgroundColor: uiTheme.colors.surfaceAlt,
    minHeight: 36,
    paddingHorizontal: uiTheme.spacing.lg,
    paddingVertical: uiTheme.spacing.sm - 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedChip: {
    borderColor: uiTheme.colors.brandBlue,
    backgroundColor: uiTheme.colors.surface,
  },
  selectedFill: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  label: {
    color: uiTheme.colors.muted,
    textDecorationLine: 'none',
  },
  selectedLabel: {
    color: uiTheme.colors.brandBlue,
    fontWeight: '600',
  },
});
