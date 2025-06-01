// frontend/components/SwipeableTask.tsx

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Task } from '../context/TaskContext';

interface Props {
  task: Task;
  onDelete: () => void;
  onSubmit: () => void;
}

export default function SwipeableTask({ task, onDelete, onSubmit }: Props) {
  const renderLeftActions = () => (
    <TouchableOpacity
      style={styles.leftAction}
      onPress={onDelete}
      accessibilityLabel="Delete Task"
      accessibilityHint="Deletes this task from the list"
    >
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.rightAction}
      onPress={onSubmit}
      accessibilityLabel="Submit Task"
      accessibilityHint="Marks this task as ready for verification"
    >
      <Text style={styles.actionText}>Submit</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      friction={2}
      leftThreshold={30}
      rightThreshold={30}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{task.name}</Text>
        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#555',
    marginTop: 4,
  },
  leftAction: {
    backgroundColor: '#cc0000',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  rightAction: {
    backgroundColor: '#3f5c2e',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: 20,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
