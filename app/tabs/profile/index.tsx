// /app/(tabs)/profile/index.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

const background = require('../../../assets/images/app background.png');

export default function ProfileScreen() {
  const { email, role, logout, token } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.date}>April 30, 2025</Text>
            <TouchableOpacity>
              <Ionicons name="menu-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Settings</Text>

          {/* Profile Card */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
                }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.profileName}>{email ?? 'Unknown User'}</Text>
                <Text style={styles.profileRole}>{(role ?? 'unknown').charAt(0).toUpperCase() + (role ?? 'unknown').slice(1)}</Text>
              </View>
            </View>

            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} placeholder="John" placeholderTextColor="#333" />

            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} placeholder="Smith" placeholderTextColor="#333" />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="johnsmith@gmail.com" placeholderTextColor="#333" />

            <Text style={styles.label}>New Password</Text>
            <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />
          </View>

          {/* Color and Layout Card */}
          <View style={styles.card}>
            <Text style={styles.customTitle}>Customization</Text>

            {/* Color options */}
            <View style={styles.colorRow}>
              {['#5d8748', '#467c8d', '#84487c', '#90503a', '#6e6b2b'].map((color, index) => (
                <TouchableOpacity key={index} style={[styles.colorDot, { backgroundColor: color }]} />
              ))}
            </View>

            <View style={styles.colorRow}>
              {['#c6d6c2', '#8fabc0', '#b09cb4', '#b38d7c', '#bfbf92'].map((color, index) => (
                <TouchableOpacity key={index} style={[styles.colorDot, { backgroundColor: color }]} />
              ))}
            </View>

            <Text style={[styles.customTitle, { marginTop: 20 }]}>Layout</Text>

            {/* Layout thumbnails */}
            <View style={styles.layoutRow}>
              {[1, 2, 3].map(i => (
                <TouchableOpacity key={i} style={styles.layoutBox}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/60x80' }}
                    style={styles.layoutImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Logout Button */}
          {token && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginTop: -30,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileRole: {
    fontSize: 14,
    color: '#999',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFF4C2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#333',
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  layoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  layoutBox: {
    width: 60,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layoutImage: {
    width: 40,
    height: 60,
  },
  logoutButton: {
    backgroundColor: '#cc0000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
