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
    // Kiểm tra user đã đăng nhập chưa
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        
        console.log('🔐 AuthContext: Initializing auth state');
        console.log('🔐 AuthContext: Current user from localStorage:', currentUser);
        console.log('🔐 AuthContext: Is authenticated:', isAuth);
        
        if (currentUser && isAuth) {
          // Validate token với server để đảm bảo token còn hợp lệ
          try {
            const isValid = await authService.validateToken();
            if (isValid) {
              setUser(currentUser);
              console.log('🔐 AuthContext: User authenticated and token valid');
            } else {
              console.log('🔐 AuthContext: Token invalid, clearing auth');
              authService.logout();
              setUser(null);
            }
          } catch (error) {
            console.log('🔐 AuthContext: Token validation failed, clearing auth');
            authService.logout();
            setUser(null);
          }
        } else {
          console.log('🔐 AuthContext: No user or not authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('🔐 AuthContext: Error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Starting login process');
      const result = await authService.login(credentials);
      console.log('🔐 AuthContext: Login result from service:', result);
      
      const userData = result.user;
      console.log('🔐 AuthContext: User data to set:', userData);
      
      setUser(userData);
      console.log('🔐 AuthContext: User set in context');
      return userData;
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
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
