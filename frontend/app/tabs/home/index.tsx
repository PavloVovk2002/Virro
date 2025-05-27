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

const background = require('../../../assets/images/appBackground.png');

const dummyTasks = [
  { id: '1', name: 'Finish wireframes', due: '2025-04-27' },
  { id: '2', name: 'User testing call', due: '2025-04-29' },
  { id: '3', name: 'Update designs', due: '2025-05-01' },
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState([...dummyTasks]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const completedPercent = 80;
  const remainingTasks = 4;
  const totalTasks = 17;

  const [fontsLoaded] = useFonts({ Baloo2_700Bold });
  if (!fontsLoaded) return null;

  const handleDelete = (rowKey) => {
    const newData = tasks.filter(task => task.id !== rowKey);
    setTasks(newData);
  };

  const handleSubmit = (rowKey) => {
    Alert.alert('Submitted', `Task "${rowKey}" submitted for verification.`);
  };

  const getDueLabel = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (due.getTime() === today.getTime()) return 'Due Today';
    if (due.getTime() < today.getTime()) return 'Past Due';
    return 'Due ' + due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}</Text>
              <Text style={styles.todayTitle}>Today</Text>
            </View>
            <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
              <Ionicons name="menu-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Progress Card */}
          <View style={styles.topCard}>
            <View style={styles.progressHeader}>
              <View style={[styles.completedBox, { flex: completedPercent / 100 }]}> 
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
              <Text style={styles.inProgressText}>In Progress • Remaining Tasks {remainingTasks}/{totalTasks}</Text>
            </View>
          </View>

          {/* Tasks */}
          <Text style={styles.sectionTitle}>Tasks</Text>

          <View style={styles.bottomCard}>
            <SwipeListView
              data={tasks} keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.taskCard}>
                  <Text style={styles.taskName}>{item.name}</Text>
                  <Text style={[styles.taskDue,
                    getDueLabel(item.due) === 'Past Due' && { color: '#000', fontWeight: '700' }]}>
                    {getDueLabel(item.due)}
                  </Text>
                </TouchableOpacity>
              )}
              renderHiddenItem={({ item }) => (
                <View style={styles.rowBack}>
                  <TouchableOpacity style={[styles.backLeftBtn, styles.swipeBtnHeight]} onPress={() => handleSubmit(item.name)}>
                    <Ionicons name="checkmark-done" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.backRightBtn, styles.swipeBtnHeight]} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              leftOpenValue={75} rightOpenValue={-75}
            />
          </View>
        </View>

        {/* Drawer */}
        <Modal transparent animationType="fade" visible={drawerVisible} onRequestClose={() => setDrawerVisible(false)}>
          <Pressable style={styles.overlay} onPress={() => setDrawerVisible(false)}>
            <View style={styles.drawer}>
              <Text style={styles.drawerItem}>👤 Profile</Text>
              <Text style={styles.drawerItem}>⚙️ Settings</Text>
              <Text style={styles.drawerItem}>🚪 Log Out</Text>
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
