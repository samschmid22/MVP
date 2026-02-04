import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LocalExerciseMediaGenerator } from '../services/exerciseMediaGenerator';
import { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../storage/appStore';
import { colors } from '../utils/theme';

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
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredCard}>
          <Text style={styles.title}>Premium Required</Text>
          <Text style={styles.subtitle}>
            Unlock "Type Any Name -> Cartoon Animation" to generate custom exercises.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Paywall')}>
            <Text style={styles.primaryButtonText}>Open Paywall</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>AI Cartoon Generator</Text>
        <Text style={styles.caption}>Type any exercise/workout name and add it to your library.</Text>

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

        {resultMessage ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{resultMessage}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  centeredCard: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    padding: 20,
    gap: 12,
  },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  caption: { color: colors.subtext },
  subtitle: { color: colors.subtext, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  primaryButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  resultCard: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#a5f3fc',
    padding: 12,
  },
  resultText: { color: '#155e75', fontWeight: '600' },
});
