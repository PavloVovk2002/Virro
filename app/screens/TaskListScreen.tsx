import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext'; // adjust if needed
import { useRouter } from 'expo-router';
import SwipeableTask from '../../components/SwipeableTask';

type Task = {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  verified?: boolean;
  verified_by?: number;
  user_id?: number;
};

export default function TaskListScreen() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [isLoading, token]);

  // ✅ Load tasks if token is present
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3001/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const handleSubmit = async (id: number) => {
    await fetch(`http://localhost:3001/tasks/${id}/submit`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  if (isLoading || loadingTasks) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3f5c2e" />
      </View>
    );
  }

  if (!tasks.length) {
    return (
      <View style={styles.center}>
        <Text>No tasks found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }: { item: Task }) => (
        <SwipeableTask
          task={item}
          onDelete={() => handleDelete(item.id)}
          onSubmit={() => handleSubmit(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
