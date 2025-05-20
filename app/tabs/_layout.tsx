import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const PRIMARY_COLOR = '#5D8748';

export default function Layout() {
  return (
<Tabs
  screenOptions={{
    tabBarStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      position: 'absolute',
      bottom: 0,        // Stick perfectly at screen bottom
      left: 0,
      right: 0,
      height: 70,       // Normal height for bottom nav
      paddingBottom: 8, // ✅ Push icons up slightly
      paddingTop: 8,    // ✅ Push icons down slightly
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

      {/* Home Tab */}
      <Tabs.Screen
        name="home/index"
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="home-outline"
              size={28}
              color={PRIMARY_COLOR}
              style={{marginBottom: -40,}}
            />
          ),
        }}
      />

      {/* Tasks Tab */}
      <Tabs.Screen
        name="tasks/index"
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="checkmark-done-outline"
              size={28}
              color={PRIMARY_COLOR}
              style={{marginBottom: -40,}}
            />
          ),
        }}
      />

      {/* Add Task (Floating Button) */}
      <Tabs.Screen
        name="add-task"
        options={{
          tabBarIcon: () => (
            <View style={styles.addButton}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          ),
        }}
      />

      {/* Calendar Tab */}
      <Tabs.Screen
        name="calendar/index"
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="calendar-outline"
              size={28}
              color={PRIMARY_COLOR}
              style={{marginBottom: -40,}}
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="person-outline"
              size={28}
              color={PRIMARY_COLOR}
              style={{marginBottom: -40,}}
            />
          ),
        }}
      />
    </Tabs>
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
