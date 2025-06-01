// frontend/app/tabs/home/index.tsx

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
  Alert, Modal, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { useTaskContext } from '../../../context/TaskContext';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'expo-router';

const background = require('../../../assets/images/appBackground.png');

export default function HomeScreen() {
  const { tasks, deleteTask } = useTaskContext();
  const { logout } = useAuth();
  const router = useRouter();
  console.log('📦 Fetched tasks from context:', tasks);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fontsLoaded] = useFonts({ Baloo2_700Bold });
  if (!fontsLoaded) return null;

  // Filter tasks due today
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const todayTasks = tasks.filter(task => {
    const due = new Date(task.due);
    return due <= today;
  });

  const completedTasks = todayTasks.filter(t => t.completed).length;
  const completedPercent = todayTasks.length === 0 ? 0 : (completedTasks / todayTasks.length) * 100;
  const remainingTasks = todayTasks.length - completedTasks;

  const handleDelete = (rowKey: number) => {
    deleteTask(Number(rowKey));
  };

  const handleSubmit = (rowKey: number) => {
    Alert.alert('Submitted', `Task "${rowKey}" submitted for verification.`);
  };

  const getDueLabel = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    if (due.getTime() === now.getTime()) return 'Due Today';
    if (due.getTime() < now.getTime()) return 'Past Due';
    return 'Due ' + due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </Text>
              <Text style={styles.todayTitle}>Today</Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                console.log('📖 Drawer opened');
                setDrawerVisible(true);
              }}
            >
              <Ionicons name="menu-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <View style={styles.topCard}>
            <View style={styles.progressHeader}>
              <View style={[styles.completedBox, { flex: completedPercent / 100 || 1 }]}>
                <Text style={styles.completedText}>Completed</Text>
              </View>
              <AnimatedCircularProgress
                size={60} width={6} fill={completedPercent}
                tintColor="#5D8748" backgroundColor="#e0e0e0" lineCap="round" rotation={0}
              >
                {fill => <Text style={styles.progressText}>{Math.round(fill)}%</Text>}
              </AnimatedCircularProgress>
            </View>
            <View style={styles.inProgressBar}>
              <Text style={styles.inProgressText}>
                In Progress • Remaining Tasks {remainingTasks}/{todayTasks.length}
              </Text>
            </View>
          </View>

          {/* Tasks */}
          <Text style={styles.sectionTitle}>Tasks</Text>
          <View style={styles.bottomCard}>
            <SwipeListView
              data={todayTasks}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.taskCard}>
                  <Text style={styles.taskName}>{item.name}</Text>
                  <Text style={[
                    styles.taskDue,
                    getDueLabel(item.due) === 'Past Due' && { color: '#000', fontWeight: '700' }
                  ]}>
                    {getDueLabel(item.due)}
                  </Text>
                </TouchableOpacity>
              )}
              renderHiddenItem={({ item }) => (
                <View style={styles.rowBack}>
                  <TouchableOpacity
                    style={[styles.backLeftBtn, styles.swipeBtnHeight]}
                    onPress={() => handleSubmit(item.id)}
                  >
                    <Ionicons name="checkmark-done" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.backRightBtn, styles.swipeBtnHeight]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              leftOpenValue={75}
              rightOpenValue={-75}
            />
          </View>
        </View>

        {/* Drawer */}
        <Modal
          transparent
          animationType="fade"
          visible={drawerVisible}
          onRequestClose={() => setDrawerVisible(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setDrawerVisible(false)}>
            <View style={styles.drawer}>
              <TouchableOpacity onPress={() => { setDrawerVisible(false); router.push('/tabs/profile'); }}>
                <Text style={styles.drawerItem}>👤 Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setDrawerVisible(false); /* Add Settings route if exists */ }}>
                <Text style={styles.drawerItem}>⚙️ Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.drawerItem}>🚪 Log Out</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    marginTop: 10, marginBottom: 16,
  },
  dateText: { color: '#fff', fontSize: 14, marginBottom: 4 },
  todayTitle: { color: '#fff', fontSize: 48, fontFamily: 'Baloo2_700Bold' },
  menuButton: { alignSelf: 'flex-start', padding: 4, marginTop: 20 },
  topCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  completedBox: { backgroundColor: '#C6D6C2', paddingVertical: 22, paddingHorizontal: 20, borderRadius: 12, marginRight: 16, flex: 1 },
  completedText: { fontSize: 18, fontWeight: '600', color: '#333' },
  progressText: { fontSize: 14, fontWeight: '700', color: '#5D8748' },
  inProgressBar: { backgroundColor: '#FFF4C2', paddingVertical: 22, paddingHorizontal: 16, borderRadius: 12 },
  inProgressText: { fontSize: 14, color: '#555', fontWeight: '500' },
  sectionTitle: { fontSize: 30, fontFamily: 'Baloo2_700Bold', color: '#fff', marginTop: 10, marginBottom: 12 },
  bottomCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, flex: 1 },
  taskCard: { backgroundColor: '#FFF4C2', borderRadius: 12, padding: 22, marginBottom: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 70 },
  taskName: { fontSize: 15, fontWeight: '600', color: '#333' },
  taskDue: { fontSize: 13, color: '#666' },
  rowBack: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22, borderRadius: 12, overflow: 'hidden' },
  swipeBtnHeight: { height: 70 },
  backLeftBtn: { backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', width: 75, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
  backRightBtn: { backgroundColor: '#E53935', justifyContent: 'center', alignItems: 'center', width: 75, borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)' },
  drawer: { width: 240, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  drawerItem: { fontSize: 18, marginVertical: 16, color: '#333' },
});
