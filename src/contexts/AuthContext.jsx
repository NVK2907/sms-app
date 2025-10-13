import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BYPASS LOGIN - Mock user data để phát triển giao diện
    const mockUser = {
      id: 1,
      username: 'admin',
      email: 'admin@sms.com',
      fullName: 'Quản trị viên',
      role: {
        id: 1,
        name: 'admin'
      }
    };
    
    // Lưu mock user vào localStorage để bypass authentication
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token-for-development');
    
    setUser(mockUser);
    setLoading(false);
    
    // Code gốc (đã comment để bypass):
    // const currentUser = authService.getCurrentUser();
    // if (currentUser && authService.isAuthenticated()) {
    //   setUser(currentUser);
    // }
    // setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { user: userData } = await authService.login(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
