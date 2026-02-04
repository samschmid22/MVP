import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useAppStore } from '../storage/appStore';
import { AppText, Button, Card, Screen, SectionHeader } from '../ui/components';
import { uiTheme } from '../ui/theme';

export const SettingsScreen = () => {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const isPremium = useAppStore((state) => state.user.isPremium);
  const setPremium = useAppStore((state) => state.setPremium);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Settings" subtitle="Tune cues, units, and premium testing options." />

        <Card accent>
          <View style={styles.cardTitleRow}>
            <Ionicons name="volume-high-outline" size={18} color={uiTheme.colors.brandPurple} />
            <AppText variant="h3">Session cues</AppText>
          </View>
          <View style={styles.row}>
            <AppText variant="body">Sound cues</AppText>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
              trackColor={{ false: uiTheme.colors.surfaceAlt, true: uiTheme.colors.brandPurple }}
              thumbColor={uiTheme.colors.white}
              ios_backgroundColor={uiTheme.colors.surfaceAlt}
            />
          </View>
          <View style={styles.row}>
            <AppText variant="body">Vibration cues</AppText>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
              trackColor={{ false: uiTheme.colors.surfaceAlt, true: uiTheme.colors.brandBlue }}
              thumbColor={uiTheme.colors.white}
              ios_backgroundColor={uiTheme.colors.surfaceAlt}
            />
          </View>
        </Card>

        <Card accent>
          <View style={styles.cardTitleRow}>
            <Ionicons name="resize-outline" size={18} color={uiTheme.colors.brandPink} />
            <AppText variant="h3">Units</AppText>
          </View>
          <View style={styles.unitRow}>
            <Pressable
              onPress={() => updateSettings({ units: 'metric' })}
              style={[styles.unitChip, settings.units === 'metric' && styles.unitChipActive]}
            >
              <AppText variant="caption" style={[styles.unitText, settings.units === 'metric' && styles.unitTextActive]}>
                Metric
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => updateSettings({ units: 'imperial' })}
              style={[styles.unitChip, settings.units === 'imperial' && styles.unitChipActive]}
            >
              <AppText variant="caption" style={[styles.unitText, settings.units === 'imperial' && styles.unitTextActive]}>
                Imperial
              </AppText>
            </Pressable>
          </View>
        </Card>

        <Card accent>
          <View style={styles.cardTitleRow}>
            <Ionicons name="sparkles-outline" size={18} color={uiTheme.colors.brandBlue} />
            <AppText variant="h3">Premium</AppText>
          </View>
          <AppText variant="caption" style={styles.mutedText}>
            Toggle this in MVP mode when store keys are not configured.
          </AppText>
          <Button
            label={isPremium ? 'Disable Premium' : 'Enable Premium'}
            variant="primary"
            onPress={() => setPremium(!isPremium)}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: uiTheme.spacing.sm,
    paddingBottom: 118,
    gap: uiTheme.spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: uiTheme.spacing.sm,
    marginBottom: uiTheme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    borderRadius: uiTheme.radius.md,
    backgroundColor: uiTheme.colors.surface,
    paddingHorizontal: uiTheme.spacing.md,
    paddingVertical: uiTheme.spacing.sm,
    marginTop: uiTheme.spacing.xs,
  },
  unitRow: {
    flexDirection: 'row',
    borderRadius: uiTheme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: uiTheme.colors.stroke,
    backgroundColor: uiTheme.colors.surface,
  },
  unitChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: uiTheme.spacing.sm + 2,
  },
  unitChipActive: {
    backgroundColor: uiTheme.colors.surface2,
  },
  unitText: {
    color: uiTheme.colors.muted,
  },
  unitTextActive: {
    color: uiTheme.colors.brandPurple,
    fontWeight: '600',
  },
  mutedText: {
    color: uiTheme.colors.muted,
    marginBottom: uiTheme.spacing.sm,
  },
});
