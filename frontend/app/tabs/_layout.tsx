import { Stack, Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import AddTaskModal from '@/components/AddTaskModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Home, PencilLine, CalendarDays, User, Plus } from 'lucide-react-native';
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
                tabBarIcon: ({ color }) => (
                  <Home size={28} color={PRIMARY_COLOR} style={{ marginBottom: 5 }} strokeWidth={2.5}/>
                ),
              }}
            />

            <Tabs.Screen
              name="tasks/index"
              options={{
                tabBarIcon: ({ color }) => (
                  <PencilLine size={28} color={PRIMARY_COLOR} style={{ marginBottom: 5 }} strokeWidth={2.5}/>
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
                    <Plus size={32} strokeWidth={2.8} color="#fff" />
                  </TouchableOpacity>
                ),
              }}
            />

            <Tabs.Screen
              name="calendar/index"
              options={{
                tabBarIcon: ({ color }) => (
                  <CalendarDays size={28} color={PRIMARY_COLOR} style={{ marginBottom: 5 }} strokeWidth={2.5}/>
                ),
              }}
            />

            <Tabs.Screen
              name="profile/index"
              options={{
                tabBarIcon: ({ color }) => (
                  <User size={28} color={PRIMARY_COLOR} style={{ marginBottom: 5 }} strokeWidth={2.8}/>
                ),
              }}
            />
          </Tabs>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.addButtonContainer}
            >
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Plus size={28} strokeWidth={2.8} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>

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
  width: 60,
  height: 60,
  borderRadius: 30,
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
  marginBottom: 5
},
  addButtonContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    marginBottom: 5

  },

  outerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 5
  },

  innerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgb(80, 109, 25)',
    shadowColor: 'rgb(210, 221, 48)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10, // For Android
    justifyContent: 'center',
    alignItems: 'center',
  },
});
