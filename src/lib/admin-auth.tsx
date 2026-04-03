'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // 检查登录状态
  const checkAuth = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
    const storedUsername = localStorage.getItem('admin_username');
    
    if (loggedIn) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      return true;
    }
    
    setIsAuthenticated(false);
    setUsername(null);
    return false;
  }, []);

  // 登录
  const login = useCallback((user: string) => {
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('admin_username', user);
    localStorage.setItem('admin_login_time', new Date().toISOString());
    setIsAuthenticated(true);
    setUsername(user);
  }, []);

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    setUsername(null);
    router.push('/admin/login');
  }, [router]);

  // 初始化时检查登录状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, username, login, logout, checkAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
