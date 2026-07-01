import { useState, useEffect } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { getProfile } from '../api/authApi';

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
    localStorage.setItem('farmwise_token', data.token);
    localStorage.setItem('farmwise_user', JSON.stringify(data.user));
    setUser(data.user);
    setFarm(data.farm);
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