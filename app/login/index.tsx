import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Baloo2_600SemiBold, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { supabase } from '../../config/supabase';
import { useRouter } from 'expo-router';
import React from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      router.replace('/tabs/home');
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      alert('Registration failed: ' + error.message);
    } else {
      alert('Success! Please check your email.');
      router.replace('/tabs/home');
    }
  };

  return (
    <View style={styles.container}>
      {/* REPLACEMENT FOR LOGO */}
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

      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister} disabled={loading}>
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
