import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useAuth } from '../context/AuthContext';
import React from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  user_id?: number;
};

export default function HomeScreen() {
  const { userId, token } = useAuth();
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
      const response = await fetch('http://localhost:3001/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const userTasks = data.filter((task: Task) => task.user_id === userId);

      setTasks(userTasks);
      setCompletedCount(userTasks.filter((task: { completed: any; }) => task.completed).length);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
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
            <Text style={styles.taskItem}>• {item.title}</Text>
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
            <Text style={styles.taskItem}>• {item.title}</Text>
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
