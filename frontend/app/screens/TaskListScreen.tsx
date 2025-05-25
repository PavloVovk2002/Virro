import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
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
  const { token, isLoading, role, userId } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [viewMode, setViewMode] = useState<'my' | 'verify'>('my');

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [isLoading, token]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, viewMode]);

  const fetchTasks = async () => {
    try {
      let url = 'http://localhost:3001/tasks';
      if (role === 'verifier' && viewMode === 'verify') {
        url = 'http://localhost:3001/verify/pending';
      }

      const res = await fetch(url, {
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
    <View style={{ flex: 1 }}>
      {role === 'verifier' && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'my' && styles.toggleButtonActive]}
            onPress={() => setViewMode('my')}
          >
            <Text style={styles.toggleText}>My Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'verify' && styles.toggleButtonActive]}
            onPress={() => setViewMode('verify')}
          >
            <Text style={styles.toggleText}>Verify Tasks</Text>
          </TouchableOpacity>
        </View>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#5D8748',
  },
  toggleText: {
    color: '#fff',
    fontWeight: '600',
  },
});
