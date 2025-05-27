import { Stack, Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import AddTaskModal from '@/components/AddTaskModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#5D8748';

export default function RootLayout() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#3f5c2e' }}>
          <StatusBar style="light" backgroundColor="#3f5c2e" />

          <Tabs
            screenOptions={{
              tabBarStyle: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
                paddingBottom: 8,
                paddingTop: 8,
                borderTopWidth: 0.5,
                borderColor: '#ccc',
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              },
              tabBarIconStyle: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
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
                tabBarButton: () => (
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

          <AddTaskModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </SafeAreaProvider>
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
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
});
