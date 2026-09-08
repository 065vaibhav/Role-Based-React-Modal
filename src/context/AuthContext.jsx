import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockApi } from '../api/mockApi';

const AuthContext = createContext(null);
const TOKEN_KEY = 'northstar_jwt';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    if (!token) {
      setLoading(false);
      setUser(null);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    mockApi
      .getCurrentUser(token)
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function signIn(credentials) {
    setLoading(true);
    setError('');
    try {
      const response = await mockApi.login(credentials);
      localStorage.setItem(TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError('');
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      error,
      signIn,
      signOut,
    }),
    [token, user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
