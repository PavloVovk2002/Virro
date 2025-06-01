// frontend/components/AddTaskModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { post } from '../api/api';
import { useAuth } from '../context/AuthContext'; // Added import

const PRIMARY_COLOR = '#5D8748';
const DRAFT_KEY = 'task_draft';

export default function AddTaskModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { token } = useAuth(); // Using useAuth to get token

  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [group, setGroup] = useState('');
  const [members, setMembers] = useState('');
  const [verifier, setVerifier] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [showRepeatDropdown, setShowRepeatDropdown] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const toggleDay = (day: string) => {
    setRepeatDays((prev) => {
      const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      if (day === 'Daily') {
        return prev.includes('Daily') || allDays.every((d) => prev.includes(d))
          ? []
          : ['Daily'];
      }
      let updated = prev.includes('Daily') ? [...allDays] : [...prev];

      if (updated.includes(day)) {
        updated = updated.filter((d) => d !== day);
      } else {
        updated.push(day);
      }

      if (allDays.every((d) => updated.includes(d))) {
        return ['Daily'];
      }

      return updated;
    });
  };

  const showDatePicker = () => {
    if (!dueDate) {
      setDueDate(new Date());
    }
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirmDate = (date: Date) => {
    setDueDate(date);
    hideDatePicker();
  };

  const saveDraft = async () => {
    const draft = {
      task,
      description,
      notes,
      group,
      members,
      verifier,
      dueDate,
      repeatDays,
    };
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (err) {
      console.warn('Failed to save draft:', err);
    }
  };

  const loadDraft = async () => {
    try {
      const saved = await AsyncStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        setTask(draft.task || '');
        setDescription(draft.description || '');
        setNotes(draft.notes || '');
        setGroup(draft.group || '');
        setMembers(draft.members || '');
        setVerifier(draft.verifier || '');
        setDueDate(draft.dueDate ? new Date(draft.dueDate) : null);
        setRepeatDays(draft.repeatDays || []);
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      console.warn('Failed to clear draft:', err);
    }
  };

  const handleSubmit = async () => {
    if (!task.trim() || !dueDate) {
      Alert.alert('Missing Fields', 'Task name and due date are required.');
      return;
    }

    try {
      const payload = {
        title: task,
        description,
        notes,
        group,
        members,
        verifier,
        dueDate: dueDate.toISOString(),
        repeatDays,
        completed: false,
      };

      await post('/tasks', payload, token); // Updated to use post() helper

      await clearDraft();

      // Reset form state
      setTask('');
      setDescription('');
      setNotes('');
      setGroup('');
      setMembers('');
      setVerifier('');
      setDueDate(null);
      setRepeatDays([]);

      onClose();
      router.replace('/tabs/tasks');
    } catch (error) {
      console.error('Error submitting task:', error);
      Alert.alert('Submission Error', 'Failed to create task. Please try again.');
    }
  };

  useEffect(() => {
    if (visible) {
      loadDraft();
    }
  }, [visible]);

  useEffect(() => {
    saveDraft();
  }, [task, description, notes, group, members, verifier, dueDate, repeatDays]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalWrapper}
        >
          <Pressable style={styles.modal} onPress={() => {}}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Create New Task</Text>

              <TextInput
                placeholder="Task Name*"
                value={task}
                onChangeText={setTask}
                style={styles.input}
              />
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
              <TextInput
                placeholder="Additional Notes"
                value={notes}
                onChangeText={setNotes}
                style={styles.input}
              />
              <TextInput
                placeholder="Group Name"
                value={group}
                onChangeText={setGroup}
                style={styles.input}
              />
              <TextInput
                placeholder="Add Members"
                value={members}
                onChangeText={setMembers}
                style={styles.input}
              />
              <TextInput
                placeholder="Verifier"
                value={verifier}
                onChangeText={setVerifier}
                style={styles.input}
              />

              <View style={styles.dateRepeatRow}>
                <TouchableOpacity style={styles.dueDateButton} onPress={showDatePicker}>
                  <Text style={{ color: dueDate ? '#000' : '#999', fontSize: 18 }}>
                    {dueDate
                      ? moment(dueDate).format('ddd, MMM D [at] h:mm A')
                      : 'Select Due Date'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.repeatButton}
                  onPress={() => setShowRepeatDropdown(!showRepeatDropdown)}
                >
                  <Text style={styles.repeatButtonText}>
                    {repeatDays.includes('Daily')
                      ? 'Repeat: Daily'
                      : repeatDays.length > 0
                      ? `Repeat: ${repeatDays.join(', ')}`
                      : 'Repeat'}
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                date={dueDate || new Date()}
                minimumDate={todayStart}
              />

              {showRepeatDropdown && (
                <View style={styles.dropdown}>
                  {['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isSelected =
                      repeatDays.includes(day) || repeatDays.includes('Daily');
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                        ]}
                      >
                        <Text style={styles.dropdownItemText}>{day}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modal: {
    height: '75%',
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 90,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: PRIMARY_COLOR,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    minHeight: 52,
    backgroundColor: 'rgb(236, 236, 236)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 18,
  },
  dateRepeatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    marginBottom: 18,
  },
  repeatButton: {
    width: '25%',
    minHeight: 52,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'rgb(200, 200, 200)',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dueDateButton: {
    width: '71.5%',
    minHeight: 52,
    backgroundColor: 'rgb(236, 236, 236)',
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  repeatButtonText: {
    fontSize: 16,
    alignContent: 'center',
    color: 'rgb(165, 165, 165)',
  },
  dropdown: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgb(200, 200, 200)',
    padding: 10,
    marginBottom: 12,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(93, 135, 72, 0.15)',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
