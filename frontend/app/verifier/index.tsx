// frontend/app/screens/VerifierScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VerifierScreen() {
  useEffect(() => {
    console.log('✅ VerifierScreen rendered');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifier</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2dbd20',
  },
});
