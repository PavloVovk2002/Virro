import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#3f5c2e' }}>
          <StatusBar style="light" backgroundColor="#3f5c2e" />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
