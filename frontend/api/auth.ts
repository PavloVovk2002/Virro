// frontend/api/auth.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAuthHeader() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No auth token found.');
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('❌ Failed to retrieve token from AsyncStorage:', error);
    return {};
  }
}
