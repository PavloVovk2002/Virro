import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as jwtDecodeModule from 'jwt-decode';


type DecodedToken = {
  userId: number;
  email: string;
  role: string;
  exp: number;
};

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  userId: number | null;
  email: string | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  userId: null,
  email: null,
  role: null,
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
      const storedToken = await SecureStore.getItemAsync('virro_token');
      if (storedToken) {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        setUserId(decoded.userId);
        setEmail(decoded.email);
        setRole(decoded.role);
        setToken(storedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    await SecureStore.setItemAsync('virro_token', newToken);
    const decoded = jwtDecode<DecodedToken>(newToken);
    setUserId(decoded.userId);
    setEmail(decoded.email);
    setRole(decoded.role);
    setToken(newToken);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('virro_token');
    setToken(null);
    setUserId(null);
    setEmail(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isLoading, userId, email, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};
