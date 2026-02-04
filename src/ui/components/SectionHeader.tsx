import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Button, ButtonVariant } from './Button';
import { uiTheme } from '../theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  actionVariant?: ButtonVariant;
};

export const SectionHeader = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  actionVariant = 'outline',
}: SectionHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.textWrap}>
      <AppText variant="h2">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
    {actionLabel ? (
      <Button variant={actionVariant} label={actionLabel} onPress={onActionPress} style={styles.action} />
    ) : null}
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
    minWidth: 130,
  },
});
