/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useMemo, useState } from 'react';
import { setAuthToken } from '../api/client';
import { clearAuth, loadAuth, saveAuth } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());

  const login = ({ token, role }) => {
    const next = { token, role };
    setAuthToken(token);
    saveAuth(next);
    setAuth(next);
  };

  const logout = () => {
    setAuthToken(null);
    clearAuth();
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      token: auth?.token,
      role: auth?.role,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
    }),
    [auth],
  );

  // Initialize token for subsequent requests
  if (auth?.token) {
    setAuthToken(auth.token);
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
