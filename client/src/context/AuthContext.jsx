import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skilltwin_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user from stored token
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('skilltwin_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('skilltwin_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to sign in. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', formData);
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('skilltwin_token', newToken);
      setToken(newToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('skilltwin_token');
    setToken(null);
    setUser(null);
  };

  const quickLogin = async (email, password = 'password123') => {
    return login(email, password);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    quickLogin,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
