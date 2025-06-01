import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import { getAuthToken } from '../../api/api';
import { API_BASE_URL } from '../../api/config';

type Task = {
  id: number;
  name: string;
  completed: boolean;
  user_id?: number;
};

export default function HomeScreen() {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchTasks();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.warn('⚠️ No auth token found.');
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        console.error(`❌ Failed to fetch tasks: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('Unexpected tasks response:', data);
        return;
      }

      const userTasks = data.filter((task: Task) => task.user_id === userId);

      setTasks(userTasks);
      setCompletedCount(userTasks.filter((task) => task.completed).length);
    } catch (error) {
      console.error('🔥 Error fetching tasks:', error);
    }
  };

  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Progress</Text>

      <Animated.View style={[styles.progressWrapper, { opacity: fadeAnim }]}>
        <AnimatedCircularProgress
          size={220}
          width={20}
          fill={progress}
          tintColor="#2dbd20"
          backgroundColor="#d9d9d9"
          duration={1200}
          rotation={0}
          lineCap="round"
        >
          {() => (
            <Text style={styles.progressText}>
              {Math.round(progress)}%
            </Text>
          )}
        </AnimatedCircularProgress>
      </Animated.View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✅ Completed Today</Text>
        <FlatList
          data={tasks.filter((task) => task.completed)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.taskItem}>• {item.name}</Text>
          )}
          ListEmptyComponent={<Text style={styles.noTasks}>No tasks completed yet.</Text>}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📝 Tasks To Complete</Text>
        <FlatList
          data={tasks.filter((task) => !task.completed)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.taskItem}>• {item.name}</Text>
          )}
          ListEmptyComponent={<Text style={styles.noTasks}>All caught up!</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#25292e',
    alignSelf: 'center',
    marginBottom: 16,
  },
  progressWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  progressText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#25292e',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#25292e',
  },
  taskItem: {
    fontSize: 16,
    paddingVertical: 6,
    color: '#333',
  },
  noTasks: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});
