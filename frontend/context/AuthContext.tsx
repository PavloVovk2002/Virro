// frontend/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  userId: number;
  email: string;
  role: string;
  exp: number;
};

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: (reason?: string) => void;
  isLoading: boolean;
  userId: number | null;
  email: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  setUserId: (id: number | null) => void;
  setRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  userId: null,
  email: null,
  role: null,
  setToken: () => {},
  setUserId: () => {},
  setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      console.log('🔍 Starting loadToken...');
      try {
        const storedToken = await SecureStore.getItemAsync('virro_token');
        console.log('📦 Retrieved token from SecureStore:', storedToken);

        if (storedToken) {
          try {
            const decoded = jwtDecode<DecodedToken>(storedToken);
            console.log('✅ Token decoded:', decoded);

            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp < currentTime) {
              console.log('⛔️ Token expired — clearing token.');
              await logout('Token expired');
            } else {
              setUserId(decoded.userId);
              setEmail(decoded.email);
              setRole(decoded.role);
              setToken(storedToken);
              console.log('✅ User loaded from stored token.');
            }
          } catch (decodeError) {
            console.error('❌ Failed to decode token:', decodeError);
            await logout('Token decoding failed');
          }
        } else {
          console.log('⚠️ No token found in SecureStore');
        }
      } catch (err) {
        console.error('🔥 Error loading token from SecureStore:', err);
      } finally {
        console.log('🔍 loadToken complete. Setting isLoading to false.');
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (newToken: string) => {
    console.log('✅ Storing token in SecureStore:', newToken);
    try {
      await SecureStore.setItemAsync('virro_token', newToken);

      const decoded = jwtDecode<DecodedToken>(newToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.log('⛔️ Token expired on login — clearing token.');
        await logout('Token expired');
      } else {
        setUserId(decoded.userId);
        setEmail(decoded.email);
        setRole(decoded.role);
        setToken(newToken);
        console.log('✅ User logged in and state updated.');
      }
    } catch (error) {
      console.error('❌ Error during login:', error);
      await logout('Token decoding or storage failed');
    }
  };

  const logout = async (reason?: string) => {
    try {
      await SecureStore.deleteItemAsync('virro_token');
    } catch (err) {
      console.error('❌ Error deleting token from SecureStore:', err);
    }
    setToken(null);
    setUserId(null);
    setEmail(null);
    setRole(null);
    console.log(`👋 User logged out and token cleared. Reason: ${reason || 'manual logout'}`);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isLoading,
        userId,
        email,
        role,
        setToken,
        setUserId,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
