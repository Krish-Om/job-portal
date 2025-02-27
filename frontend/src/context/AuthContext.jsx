import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};