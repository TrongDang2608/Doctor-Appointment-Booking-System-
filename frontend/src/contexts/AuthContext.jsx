import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    console.log('AuthContext mount - currentUser from localStorage:', currentUser);
    if (currentUser) {
      setUser(currentUser);
      console.log('AuthContext - User restored from localStorage:', currentUser);
    } else {
      console.log('AuthContext - No user found in localStorage');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const authResponse = await authService.login(username, password);
      console.log('Auth response received:', authResponse);
      
      // Save to localStorage
      authService.setAuthData(authResponse);
      
      // Update state
      const userData = {
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        role: authResponse.role,
        fullName: authResponse.fullName,
      };
      setUser(userData);
      console.log('User state updated:', userData);
      
      return authResponse;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const authResponse = await authService.register(userData);
      authService.setAuthData(authResponse);
      setUser({
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        role: authResponse.role,
        fullName: authResponse.fullName,
      });
      return authResponse;
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
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

