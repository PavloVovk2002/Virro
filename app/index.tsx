import React from 'react';
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '../config/supabase';

const DEV_MODE = true; // change to false later

export default function AppIndex() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setSessionChecked(true);
    });
  }, []);

if (DEV_MODE) {
  return <Redirect href="/tabs/home" />;
}

if (!sessionChecked) return null;

return <Redirect href={isLoggedIn ? '/tabs/home' : '/login'} />;
  if (!sessionChecked) return null;

// return <Redirect href={isLoggedIn ? '/tabs/home' : '/login'} />;
  return <Redirect href="/tabs/home" />;
}

