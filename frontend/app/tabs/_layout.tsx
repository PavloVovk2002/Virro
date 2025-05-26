import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import AddTaskModal from '@/components/AddTaskModal'; 

const PRIMARY_COLOR = '#5D8748';

export default function Layout() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 0.5,
            borderColor: '#ccc',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            tabBarIcon: () => (
              <Ionicons name="home-outline" size={28} color={PRIMARY_COLOR} />
            ),
          }}
        />

        <Tabs.Screen
          name="tasks/index"
          options={{
            tabBarIcon: () => (
              <Ionicons name="checkmark-done-outline" size={28} color={PRIMARY_COLOR} />
            ),
          }}
        />

        <Tabs.Screen
          name="add-placeholder"
          options={{
            tabBarIcon: () => (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.addButton}
              >
                <Ionicons name="add" size={32} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="calendar/index"
          options={{
            tabBarIcon: () => (
              <Ionicons name="calendar-outline" size={28} color={PRIMARY_COLOR} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile/index"
          options={{
            tabBarIcon: () => (
              <Ionicons name="person-outline" size={28} color={PRIMARY_COLOR} />
            ),
          }}
        />
      </Tabs>

      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
});
