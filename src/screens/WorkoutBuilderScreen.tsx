import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { RootStackParamList } from '../navigation/types';
import { useAppStore, useWorkoutItems } from '../storage/appStore';
import { Exercise } from '../types/models';
import { createId } from '../utils/id';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutBuilder'>;

type DraftItem = {
  id: string;
  exerciseId: string;
  durationSec: number;
  restSec: number;
};

export const WorkoutBuilderScreen = ({ route, navigation }: Props) => {
  const workoutId = route.params?.workoutId;
  const workouts = useAppStore((state) => state.workouts);
  const exercises = useAppStore((state) => state.exercises);
  const saveWorkout = useAppStore((state) => state.saveWorkout);
  const deleteWorkout = useAppStore((state) => state.deleteWorkout);
  const duplicateWorkout = useAppStore((state) => state.duplicateWorkout);
  const existingItems = useWorkoutItems(workoutId ?? '');
  const existingWorkout = workouts.find((w) => w.id === workoutId);

  const [name, setName] = useState(existingWorkout?.name ?? '');
  const [description, setDescription] = useState(existingWorkout?.description ?? '');
  const [items, setItems] = useState<DraftItem[]>(
    existingItems.map((item) => ({
      id: item.id,
      exerciseId: item.exerciseId,
      durationSec: item.durationSec,
      restSec: item.restSec,
    })),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');

  const filteredExercises = useMemo(
    () =>
      exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(exerciseSearch.trim().toLowerCase()),
      ),
    [exerciseSearch, exercises],
  );

  const addExercise = (exercise: Exercise) => {
    setItems((prev) => [
      ...prev,
      {
        id: createId('draft_item'),
        exerciseId: exercise.id,
        durationSec: exercise.defaultDurationSec,
        restSec: 15,
      },
    ]);
    setModalVisible(false);
  };

  const save = () => {
    const finalName = name.trim() || 'Untitled Workout';
    const finalDescription = description.trim();
    const id = saveWorkout(
      {
        id: workoutId,
        name: finalName,
        description: finalDescription,
      },
      items,
    );
    navigation.replace('WorkoutBuilder', { workoutId: id });
  };

  const itemExerciseMap = useMemo(
    () => Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises],
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<DraftItem>) => {
    const exercise = itemExerciseMap[item.exerciseId];
    if (!exercise) return null;

    return (
      <Pressable
        onLongPress={drag}
        delayLongPress={120}
        style={[styles.itemCard, isActive && styles.itemCardActive]}
      >
        <Text style={styles.itemTitle}>{exercise.name}</Text>
        <View style={styles.durationRow}>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Duration (sec)</Text>
            <TextInput
              keyboardType="number-pad"
              value={`${item.durationSec}`}
              onChangeText={(text) => {
                const value = Number(text) || 0;
                setItems((prev) =>
                  prev.map((existing) =>
                    existing.id === item.id ? { ...existing, durationSec: Math.max(5, value) } : existing,
                  ),
                );
              }}
              style={styles.smallInput}
            />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Rest (sec)</Text>
            <TextInput
              keyboardType="number-pad"
              value={`${item.restSec}`}
              onChangeText={(text) => {
                const value = Number(text) || 0;
                setItems((prev) =>
                  prev.map((existing) =>
                    existing.id === item.id ? { ...existing, restSec: Math.max(0, value) } : existing,
                  ),
                );
              }}
              style={styles.smallInput}
            />
          </View>
          <Pressable
            onPress={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>{workoutId ? 'Edit Workout' : 'Create Workout'}</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Workout name"
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor="#94a3b8"
          multiline
        />

        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add exercise</Text>
        </Pressable>

        {items.length === 0 ? (
          <EmptyState
            title="No exercises yet"
            subtitle="Add exercises, set custom durations, then drag to reorder."
          />
        ) : (
          <View style={{ minHeight: 300 }}>
            <DraggableFlatList
              data={items}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => setItems(data)}
              renderItem={renderItem}
              scrollEnabled={false}
              containerStyle={{ gap: 10 }}
            />
          </View>
        )}

        <Pressable style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </Pressable>

        {workoutId ? (
          <View style={styles.bottomRow}>
            <Pressable style={styles.subtleButton} onPress={() => duplicateWorkout(workoutId)}>
              <Text style={styles.subtleButtonText}>Duplicate</Text>
            </Pressable>
            <Pressable
              style={[styles.subtleButton, styles.dangerButton]}
              onPress={() => {
                deleteWorkout(workoutId);
                navigation.goBack();
              }}
            >
              <Text style={[styles.subtleButtonText, styles.dangerButtonText]}>Delete</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          <TextInput
            value={exerciseSearch}
            onChangeText={setExerciseSearch}
            style={styles.input}
            placeholder="Search exercise"
            placeholderTextColor="#94a3b8"
          />
          <ScrollView contentContainerStyle={styles.modalList}>
            {filteredExercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                style={styles.modalItem}
                onPress={() => addExercise(exercise)}
              >
                <Text style={styles.modalItemTitle}>{exercise.name}</Text>
                <Text style={styles.modalItemMeta}>
                  {exercise.category} - {exercise.defaultDurationSec}s
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 27, fontWeight: '800', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  addButton: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  addButtonText: { color: colors.primary, fontWeight: '700' },
  itemCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  itemCardActive: { opacity: 0.7 },
  itemTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  durationRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  inputWrap: { flex: 1, gap: 4 },
  inputLabel: { fontSize: 11, color: colors.subtext, fontWeight: '700' },
  smallInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    color: colors.text,
  },
  removeButton: { paddingHorizontal: 10, paddingVertical: 8 },
  removeText: { color: colors.danger, fontWeight: '700' },
  saveButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '800' },
  bottomRow: { flexDirection: 'row', gap: 8, paddingBottom: 30 },
  subtleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  subtleButtonText: { color: colors.subtext, fontWeight: '700' },
  dangerButton: { borderColor: '#fecaca', backgroundColor: '#fef2f2' },
  dangerButtonText: { color: colors.danger },
  modalContainer: { flex: 1, backgroundColor: colors.bg, padding: 16, gap: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  closeText: { color: colors.primary, fontWeight: '700' },
  modalList: { gap: 8, paddingBottom: 20 },
  modalItem: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  modalItemTitle: { color: colors.text, fontWeight: '700' },
  modalItemMeta: { color: colors.subtext, fontSize: 12 },
});
