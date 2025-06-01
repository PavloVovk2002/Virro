// frontend/app/index.tsx

// frontend/app/index.tsx

import React, { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 isLoading:', isLoading, 'token:', token);

    if (!isLoading) {
      if (token) {
        console.log('✅ Token found, navigating to home');
        router.replace('/tabs/home');
      } else {
        console.log('🚫 No token found, navigating to login');
        router.replace('/login');
      }
    }
  }, [token, isLoading, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <ActivityIndicator size="large" color="#5D8748" />
      <Text style={{ marginTop: 20 }}>Loading authentication status...</Text>
    </View>
  );
}
