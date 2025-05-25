import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';


export default function AddTaskScreen() {
  const router = useRouter();
  const [task, setTask] = useState('');
  const [group, setGroup] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleClose = () => {
    router.back(); // close modal
  };

  const handleSubmit = () => {
    console.log('Task submitted:', { task, group, dueDate });
    // TODO: Send to Supabase
    handleClose();
  };

return (
  <Modal transparent animationType="fade">
    <TouchableWithoutFeedback onPress={handleClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modal}
          >
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
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
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
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 200,
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
  cancelText: {
    marginTop: 16,
    color: '#aaa',
    fontSize: 14,
  },
});

