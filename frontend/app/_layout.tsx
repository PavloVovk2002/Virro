// frontend/app/_layout.tsx

import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import LoadingScreen from '../components/LoadingScreen';
import AuthProvider, { useAuth } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';

export default function Layout() {
  return (
    <AuthProvider>
      <LayoutWithAuth />
    </AuthProvider>
  );
}

function LayoutWithAuth() {
  const { isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      console.log('🔍 No token, navigating to login...');
      router.replace('/login');
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    console.log('🔍 Still loading auth status...');
    return <LoadingScreen />;
  }

  return (
    <TaskProvider>
      <Slot />
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
});
