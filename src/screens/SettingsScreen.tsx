import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/Buttons';
import { Screen } from '../components/Screen';
import { useAppStore } from '../storage/appStore';
import { theme } from '../theme';

export const SettingsScreen = () => {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const isPremium = useAppStore((state) => state.user.isPremium);
  const setPremium = useAppStore((state) => state.setPremium);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>Settings</Text>
          <Text style={styles.subheading}>Tune cues, units, and premium debug options.</Text>
        </View>

        <Card accentColor={theme.category.Mobility}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark-outline" size={18} color={theme.category.Mobility} />
            <Text style={styles.cardTitle}>Safety</Text>
          </View>
          <Text style={styles.cardText}>Not medical advice. Stop if pain. Consult a professional.</Text>
        </Card>

        <Card accentColor={theme.category.Posture}>
          <View style={styles.cardHeader}>
            <Ionicons name="volume-high-outline" size={18} color={theme.category.Posture} />
            <Text style={styles.cardTitle}>Session cues</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sound cues</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Vibration cues</Text>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
            />
          </View>
        </Card>

        <Card accentColor={theme.category.Stability}>
          <View style={styles.cardHeader}>
            <Ionicons name="resize-outline" size={18} color={theme.category.Stability} />
            <Text style={styles.cardTitle}>Units</Text>
          </View>
          <View style={styles.segmentedRow}>
            <Pressable
              style={[styles.segmentBtn, settings.units === 'metric' && styles.segmentBtnActive]}
              onPress={() => updateSettings({ units: 'metric' })}
            >
              <Text style={[styles.segmentBtnText, settings.units === 'metric' && styles.segmentBtnTextActive]}>
                Metric
              </Text>
            </Pressable>
            <Pressable
              style={[styles.segmentBtn, settings.units === 'imperial' && styles.segmentBtnActive]}
              onPress={() => updateSettings({ units: 'imperial' })}
            >
              <Text
                style={[styles.segmentBtnText, settings.units === 'imperial' && styles.segmentBtnTextActive]}
              >
                Imperial
              </Text>
            </Pressable>
          </View>
        </Card>

        <Card accentColor={theme.category.Balance}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles-outline" size={18} color={theme.category.Balance} />
            <Text style={styles.cardTitle}>Premium debug</Text>
          </View>
          <Text style={styles.cardText}>Use this for MVP testing without store keys.</Text>
          <PrimaryButton
            label={isPremium ? 'Disable Premium' : 'Enable Premium'}
            onPress={() => setPremium(!isPremium)}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 116,
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xs,
  },
  heading: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  subheading: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  cardTitle: {
    ...theme.typography.h2,
    fontSize: 18,
    color: theme.colors.text,
  },
  cardText: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  rowLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  segmentedRow: {
    flexDirection: 'row',
    borderRadius: theme.radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  segmentBtnActive: {
    backgroundColor: theme.colors.pastelBlue,
  },
  segmentBtnText: {
    ...theme.typography.small,
    color: theme.colors.muted,
  },
  segmentBtnTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
