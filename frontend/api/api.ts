// frontend/api/api.ts

import { API_BASE_URL } from './config';
import * as SecureStore from 'expo-secure-store';

// Helper to get token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync('virro_token');
    console.log('📦 Retrieved token from SecureStore:', token);
    return token;
  } catch (error) {
    console.error('❌ Error getting auth token:', error);
    return null;
  }
};

// Generic GET request
export const get = async (endpoint: string): Promise<any> => {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token ?? ''}`,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });

    if (!response.ok) {
      console.error(`❌ GET ${endpoint} failed with status ${response.status}`);
      throw new Error(`GET ${endpoint} failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Generic DELETE request
export const del = async (endpoint: string): Promise<any> => {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token ?? ''}`,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error deleting ${endpoint}:`, error);
    throw error;
  }
};

// Generic PATCH request
export const patch = async (endpoint: string, body: any): Promise<any> => {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token ?? ''}`,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PATCH ${endpoint} failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error patching ${endpoint}:`, error);
    throw error;
  }
};
