import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
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
        <View>
          <Text style={styles.heading}>Settings</Text>
          <Text style={styles.subheading}>Tune your cues, units, and app preferences</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardAccent} />
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={17} color={theme.category.Mobility} />
            <Text style={styles.cardTitle}>Safety</Text>
          </View>
          <Text style={styles.cardText}>Not medical advice. Stop if pain. Consult a professional.</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.cardAccent, { backgroundColor: theme.category.Posture }]} />
          <View style={styles.cardHeader}>
            <Ionicons name="volume-high" size={17} color={theme.category.Posture} />
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
        </View>

        <View style={styles.card}>
          <View style={[styles.cardAccent, { backgroundColor: theme.category.Stability }]} />
          <View style={styles.cardHeader}>
            <Ionicons name="resize" size={17} color={theme.category.Stability} />
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
        </View>

        <View style={styles.card}>
          <View style={[styles.cardAccent, { backgroundColor: theme.category.Balance }]} />
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={17} color={theme.category.Balance} />
            <Text style={styles.cardTitle}>Premium debug</Text>
          </View>
          <Text style={styles.cardText}>Use this for MVP testing without store keys.</Text>
          <Pressable style={styles.mockButton} onPress={() => setPremium(!isPremium)}>
            <Text style={styles.mockButtonText}>{isPremium ? 'Disable Premium' : 'Enable Premium'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
    gap: theme.spacing.md,
  },
  heading: {
    ...theme.type.h1,
    color: theme.colors.text,
  },
  subheading: {
    marginTop: 2,
    ...theme.type.body,
    color: theme.colors.muted,
  },
  card: {
    backgroundColor: '#FFFFFFE8',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadow.soft,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.category.Mobility,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    ...theme.type.subtitle,
    color: theme.colors.text,
  },
  cardText: {
    ...theme.type.body,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  rowLabel: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  segmentedRow: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segmentBtn: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#DBEAFE',
  },
  segmentBtnText: {
    color: theme.colors.muted,
    fontWeight: '700',
    fontSize: 13,
  },
  segmentBtnTextActive: {
    color: theme.colors.primary,
  },
  mockButton: {
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingVertical: 11,
    alignItems: 'center',
  },
  mockButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
});
