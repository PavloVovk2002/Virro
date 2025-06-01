// frontend/app/tabs/_layout.tsx

import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import AddTaskModal from '../../components/AddTaskModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Home, PencilLine, CalendarDays, User, Plus } from 'lucide-react-native';

const PRIMARY_COLOR = '#5D8748';

export default function RootLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={{ marginTop: 20 }}>Loading app...</Text>
      </View>
    );
  }

  if (!token) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#3f5c2e' }}>
        <StatusBar style="light" backgroundColor="#3f5c2e" />

        <Tabs
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarIconStyle: styles.tabBarIcon,
            tabBarShowLabel: false,
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="home/index"
            options={{
              tabBarIcon: () => (
                <Home size={28} color={PRIMARY_COLOR} style={styles.icon} strokeWidth={2.5} />
              ),
            }}
          />
          <Tabs.Screen
            name="tasks/index"
            options={{
              tabBarIcon: () => (
                <PencilLine size={28} color={PRIMARY_COLOR} style={styles.icon} strokeWidth={2.5} />
              ),
            }}
          />
          <Tabs.Screen
            name="add-placeholder"
            options={{
              tabBarButton: () => (
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                  <Plus size={32} strokeWidth={2.8} color="#fff" />
                </TouchableOpacity>
              ),
            }}
          />
          <Tabs.Screen
            name="calendar/index"
            options={{
              tabBarIcon: () => (
                <CalendarDays size={28} color={PRIMARY_COLOR} style={styles.icon} strokeWidth={2.5} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile/index"
            options={{
              tabBarIcon: () => (
                <User size={28} color={PRIMARY_COLOR} style={styles.icon} strokeWidth={2.8} />
              ),
            }}
          />
        </Tabs>

        <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 105,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBarIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 5,
  },
  icon: {
    marginBottom: 5,
  },
});
