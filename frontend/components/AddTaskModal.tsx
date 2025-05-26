import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';

export default function AddTaskModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const [task, setTask] = useState('');
  const [group, setGroup] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task, group, dueDate, completed: false }),
      });

      setTask('');
      setGroup('');
      setDueDate('');

      onClose(); // close modal
      router.replace('/tabs/tasks'); // redirect
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalWrapper}
        >
          <Pressable style={styles.modal} onPress={() => {}}>
            <Text style={styles.title}>Create New Task</Text>

            <TextInput
              placeholder="Task Name"
              value={task}
              onChangeText={setTask}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Group"
              value={group}
              onChangeText={setGroup}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Due Date (e.g., 2025-05-01)"
              value={dueDate}
              onChangeText={setDueDate}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Add Task</Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2dbd20',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2dbd20',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 25,
    width: '100%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
