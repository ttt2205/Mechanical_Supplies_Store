import { fetchApi } from '@/lib/api';
﻿import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, user: User, permissions: string[]) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load from localStorage or API on mount
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const storedPerms = localStorage.getItem('permissions');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setPermissions(storedPerms ? JSON.parse(storedPerms) : []);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, user: User, perms: string[]) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('permissions', JSON.stringify(perms));
    setUser(user);
    setPermissions(perms);
    router.push('/admin');
  };

  const logout = async () => {
    try { await fetchApi('/Authentication/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    setUser(null);
    setPermissions([]);
    router.push('/login');
  };

  const hasPermission = (permission: string) => {
    if (user?.role === 'admin') return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, permissions, isAuthenticated: !!user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
