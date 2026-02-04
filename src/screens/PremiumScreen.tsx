import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { LocalExerciseMediaGenerator } from '../services/exerciseMediaGenerator';
import { useAppStore } from '../storage/appStore';
import { Screen } from '../components/Screen';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Premium'>;

export const PremiumScreen = ({ navigation }: Props) => {
  const exercises = useAppStore((state) => state.exercises);
  const isPremium = useAppStore((state) => state.user.isPremium);
  const addCustomExercise = useAppStore((state) => state.addCustomExercise);

  const [inputName, setInputName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const generator = useMemo(() => new LocalExerciseMediaGenerator({ existingExercises: exercises }), [exercises]);

  if (!isPremium) {
    return (
      <Screen>
        <View style={styles.centeredCard}>
          <Text style={styles.title}>Premium Required</Text>
          <Text style={styles.subtitle}>
            Unlock "Type Any Name to Cartoon Animation" to generate custom exercises.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Paywall')}>
            <Text style={styles.primaryButtonText}>Open Paywall</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.heading}>AI Cartoon Generator</Text>
          <Text style={styles.caption}>Type any exercise/workout name and add it to your library.</Text>
        </View>

        <LinearGradient colors={theme.gradients.cardBluePink} style={styles.panel}>
          <TextInput
            style={styles.input}
            value={inputName}
            onChangeText={setInputName}
            placeholder="e.g., 90/90 hip switch"
            placeholderTextColor="#94a3b8"
          />

          <Pressable
            style={styles.primaryButton}
            disabled={loading || inputName.trim().length < 3}
            onPress={async () => {
              setLoading(true);
              setResultMessage(null);
              try {
                const generated = await generator.generateExerciseMedia(inputName.trim());
                const created = addCustomExercise({
                  name: inputName.trim(),
                  category: 'Mobility',
                  tags: generated.tags,
                  bodyAreas: ['Full Body'],
                  difficulty: 'Beginner',
                  instructions: generated.instructions,
                  defaultDurationSec: generated.durationDefault,
                  mediaType: generated.mediaType,
                  mediaUrl: generated.mediaUrl,
                });
                setResultMessage(`Added: ${created.name}. You can find it in Library.`);
              } catch {
                setResultMessage('Something went wrong while generating media. Try again.');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Generate Cartoon Exercise</Text>
            )}
          </Pressable>
        </LinearGradient>

        {resultMessage ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{resultMessage}</Text>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { paddingTop: theme.spacing.sm, paddingBottom: 120, gap: 14 },
  centeredCard: {
    marginTop: 30,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFFEA',
    padding: 20,
    gap: 12,
    ...theme.shadow.card,
  },
  heading: { ...theme.type.h1, color: theme.colors.text },
  title: { fontSize: 26, fontWeight: '800', color: theme.colors.text },
  caption: { color: theme.colors.muted, marginTop: 2 },
  subtitle: { color: theme.colors.muted, lineHeight: 20 },
  panel: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
  },
  primaryButton: {
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  resultCard: {
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#a5f3fc',
    padding: 12,
  },
  resultText: { color: '#155e75', fontWeight: '600' },
});
