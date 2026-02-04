import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { uiTheme } from '../theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const SectionHeader = ({ title, subtitle, actionLabel, onActionPress }: SectionHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.textWrap}>
      <AppText variant="h2">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
    {actionLabel ? <Button variant="secondary" label={actionLabel} onPress={onActionPress} style={styles.action} /> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.sm,
  },
  textWrap: {
    flex: 1,
    gap: uiTheme.spacing.xs,
  },
  subtitle: {
    color: uiTheme.colors.muted,
  },
  action: {
    minWidth: 120,
  },
});
