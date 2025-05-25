import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface Props {
  task: any;
  onDelete: () => void;
  onSubmit: () => void;
}

export default function SwipeableTask({ task, onDelete, onSubmit }: Props) {
  const renderLeftActions = () => (
    <TouchableOpacity style={styles.leftAction} onPress={onDelete}>
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity style={styles.rightAction} onPress={onSubmit}>
      <Text style={styles.actionText}>Submit</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{task.title}</Text>
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
    backgroundColor: '#cc0000', // Delete - red
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  rightAction: {
    backgroundColor: '#3f5c2e', // Submit - dark green
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
