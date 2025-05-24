import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts, Baloo2_600SemiBold, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Baloo2_600SemiBold,
    Baloo2_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2dbd20" />
      </View>
    );
  }

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.token) {
        login(data.token); // ✅ Save to SecureStore + context
        router.replace('/tabs/home');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      alert('Something went wrong.');
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert('Registration successful! You can now log in.');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Virro</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Baloo2_700Bold',
    color: '#2dbd20',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#2dbd20',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
