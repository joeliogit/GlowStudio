import { createContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem('gs_token'));
  const [loading, setLoading] = useState(true);

  // Load user from server if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem('gs_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        sessionStorage.removeItem('gs_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    sessionStorage.setItem('gs_token', authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('gs_token');
  }, []);

  const isAuthenticated = Boolean(user && token);

  const isClient = user?.role === 'client';
  const isReceptionist = user?.role === 'receptionist';
  const isAdmin = user?.role === 'admin';
  const isStaff = isReceptionist || isAdmin;

  const hasRole = useCallback(
    (...roles) => roles.includes(user?.role),
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isClient,
        isReceptionist,
        isAdmin,
        isStaff,
        hasRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
