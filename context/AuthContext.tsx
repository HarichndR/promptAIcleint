'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (interests: string[]) => Promise<void>;
  setUser: (user: User) => void;
  openAuthModal: (tab?: 'login' | 'register', message?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: any) => {
    const { data } = await authApi.login(credentials);
    setUser(data.user);
    const target = data.user.role === 'admin' ? '/admin' : '/prompts';
    router.push(target);
  };

  const register = async (regData: any) => {
    const { data } = await authApi.register(regData);
    setUser(data.user);
    const target = data.user.role === 'admin' ? '/admin' : '/prompts';
    router.push(target);
  };


  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const completeOnboarding = async (interests: string[]) => {
    const { data } = await authApi.completeOnboarding(interests);
    setUser(data.user);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login', message?: string) => {
    const query = message ? `?message=${encodeURIComponent(message)}` : '';
    router.push(`/${tab}${query}`);
  };

  const closeAuthModal = () => {
    // No longer used in page-based auth
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      completeOnboarding,
      setUser,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
