import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('farmwise_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data.data.user);
      setFarm(res.data.data.farm);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (data) => {
    if (data.token) {
      localStorage.setItem('farmwise_token', data.token);
    }
    if (data.user) {
      localStorage.setItem('farmwise_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    if (data.farm) {
      setFarm(data.farm);
    }
  };

  const logout = () => {
    localStorage.removeItem('farmwise_token');
    localStorage.removeItem('farmwise_user');
    setUser(null);
    setFarm(null);
  };

  return (
    <AuthContext.Provider value={{ user, farm, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};