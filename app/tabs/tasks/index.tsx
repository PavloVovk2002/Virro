// /app/(tabs)/tasks/index.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { useRouter } from 'expo-router';

const background = require('../../../assets/images/app background.png');

const dummyTasks = [
  { id: '1', name: 'Finish wireframes', due: '2025-04-27' },
  { id: '2', name: 'User testing call', due: '2025-04-29' },
  { id: '3', name: 'Update designs', due: '2025-05-01' },
  {
    id: 'group',
    isGroup: true,
    name: 'Group Project',
    description: 'Design system audit',
    due: '2025-05-03',
    progress: 20,
  },
  { id: '4', name: 'Client feedback', due: '2025-05-05' },
  { id: '5', name: 'Email marketing draft', due: '2025-05-06' },
  { id: '6', name: 'Revise onboarding flow', due: '2025-05-07' },
  { id: '7', name: 'Push production build', due: '2025-05-08' },
];

export default function TasksScreen() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [tasks, setTasks] = useState(dummyTasks);

  let [fontsLoaded] = useFonts({ Baloo2_700Bold });
  if (!fontsLoaded) return null;

  const handleDelete = (rowKey: string) => {
    const newData = tasks.filter(task => task.id !== rowKey);
    setTasks(newData);
  };

  const handleSubmit = (rowKey: string) => {
    Alert.alert('Submitted', `Task "${rowKey}" submitted for verification.`);
  };

  const getDueLabel = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (due.getTime() === today.getTime()) return 'Due Today';
    if (due.getTime() < today.getTime()) return 'Past Due';
    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return `${daysLeft} Days Left`;
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.title}>Tasks</Text>
            </View>
            <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
              <Ionicons name="menu-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            <SwipeListView
              data={tasks}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                if (item.isGroup) {
                  return (
                    <View style={styles.groupCard}>
                      <Text style={styles.groupName}>Group Name</Text>
                      <Text style={styles.groupDesc}>{item.description}</Text>
                      <Text style={styles.teamLabel}>Team</Text>
                      <View style={styles.teamRow}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name="person-circle"
                            size={28}
                            color="#444"
                            style={{ marginRight: 6 }}
                          />
                        ))}
                        <Ionicons name="add-circle" size={28} color="#5D8748" />
                      </View>
                      <View style={styles.groupFooter}>
                        <View style={styles.groupDate}>
                          <Ionicons name="calendar-outline" size={16} color="#555" />
                          <Text style={styles.dateLabel}>Jun 17, 2025</Text>
                        </View>
                        <AnimatedCircularProgress
                          size={50}
                          width={6}
                          fill={item.progress}
                          tintColor="#5D8748"
                          backgroundColor="#e0e0e0"
                          rotation={0}
                        >
                          {fill => <Text style={styles.progressText}>{Math.round(fill)}%</Text>}
                        </AnimatedCircularProgress>
                      </View>
                    </View>
                  );
                }

                const dueLabel = getDueLabel(item.due);

                return (
                  <TouchableOpacity activeOpacity={0.7} style={styles.taskCard}>
                    <Text style={styles.taskName}>{item.name}</Text>
                    <Text style={[styles.taskDue, dueLabel === 'Past Due' && { color: '#000', fontWeight: 'bold' }]}> 
                      {dueLabel}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              renderHiddenItem={({ item }) => {
                const heightStyle = item.isGroup ? { height: 200 } : {};
                return (
                  <View style={[styles.rowBack, heightStyle]}>
                    <TouchableOpacity style={styles.backLeftBtn} onPress={() => handleSubmit(item.name)}>
                      <Ionicons name="checkmark-done" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backRightBtn} onPress={() => handleDelete(item.id)}>
                      <Ionicons name="trash" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                );
              }}
              leftOpenValue={75}
              rightOpenValue={-75}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Drawer */}
      <Modal transparent animationType="fade" visible={drawerVisible} onRequestClose={() => setDrawerVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setDrawerVisible(false)}>
          <View style={styles.drawer}>
            <TouchableOpacity onPress={() => { setDrawerVisible(false); router.push('/tabs/profile'); }}>
              <Text style={styles.drawerItem}>👤 Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setDrawerVisible(false); router.push('/tabs/profile'); }}>
              <Text style={styles.drawerItem}>⚙️ Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.drawerItem}>🚪 Log Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  dateText: { color: '#fff', fontSize: 14, marginTop: -40, marginBottom: 4 },
  title: { color: '#fff', fontSize: 48, fontFamily: 'Baloo2_700Bold' },
  menuButton: {
    padding: 8,
    alignSelf: 'flex-start', // aligns with title
  },
  cardContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, flex: 1 },
  taskCard: {
    backgroundColor: '#FFF4C2',
    borderRadius: 12,
    padding: 22,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskName: { fontSize: 15, fontWeight: '600', color: '#333' },
  taskDue: { fontSize: 13, color: '#666' },
  rowBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    borderRadius: 12,
    overflow: 'hidden',
  },
  backLeftBtn: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: 75,
    height: '99%',
  },
  backRightBtn: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: 75,
    height: '99%',
  },
  drawer: {
    width: 240,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerItem: { fontSize: 18, marginVertical: 16, color: '#333' },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  groupCard: {
    backgroundColor: '#FFF4C2',
    borderRadius: 12,
    padding: 22,
    marginBottom: 22,
  },
  groupName: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: '#333' },
  groupDesc: { fontSize: 13, color: '#444', marginBottom: 12 },
  teamLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 0, marginBottom: 12, marginRight: -10,},
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -40,
    gap: 6,
  },
  dateLabel: { fontSize: 13, color: '#555' },
  progressText: { fontSize: 14, fontWeight: '700', color: '#5D8748' },
});
