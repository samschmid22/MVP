import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useAppStore } from '../storage/appStore';
import { colors } from '../utils/theme';

export const SettingsScreen = () => {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const isPremium = useAppStore((state) => state.user.isPremium);
  const setPremium = useAppStore((state) => state.setPremium);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety disclaimer</Text>
          <Text style={styles.cardText}>
            Not medical advice. Stop if pain. Consult a professional.
          </Text>
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

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Units</Text>
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
          <Text style={styles.cardTitle}>Premium debug toggle</Text>
          <Text style={styles.cardText}>Use this for MVP testing without store keys.</Text>
          <Pressable
            style={styles.mockButton}
            onPress={() => setPremium(!isPremium)}
          >
            <Text style={styles.mockButtonText}>{isPremium ? 'Disable Premium' : 'Enable Premium'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardText: { color: colors.subtext, lineHeight: 20 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: { color: colors.text, fontWeight: '700' },
  segmentedRow: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  segmentBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  segmentBtnActive: { backgroundColor: colors.primarySoft },
  segmentBtnText: { color: colors.subtext, fontWeight: '700' },
  segmentBtnTextActive: { color: colors.primary },
  mockButton: {
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#111827',
    paddingVertical: 10,
    alignItems: 'center',
  },
  mockButtonText: { color: '#fff', fontWeight: '700' },
});
