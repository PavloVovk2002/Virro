import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from './context/AuthContext';

const DEV_MODE = true; // set to false in production

export default function AppIndex() {
  const { token } = useAuth();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
    setSessionChecked(true);
  }, [token]);

  if (DEV_MODE) {
    return <Redirect href="/tabs/home" />;
  }

  if (!sessionChecked) return null;

  return <Redirect href={isLoggedIn ? '/tabs/home' : '/login'} />;
}
