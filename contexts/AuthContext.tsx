import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, isAuthenticated, getCurrentUserFromStorage, logout as logoutService } from '../services/auth';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const setUser = (userData: User | null) => {
    setUserState(userData);
    setIsAuth(!!userData);
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthRoutes = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'index';
    const inDashboard = segments[0] === 'dashboard';

    if (!isAuth && inDashboard) {
      router.replace('/login');
    } else if (isAuth && (segments[0] === 'login' || segments[0] === 'signup')) {
      router.replace('/dashboard');
    }
  }, [isAuth, segments, loading]);

  const loadUser = async () => {
    try {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);

      if (authenticated) {
        const userData = await getCurrentUserFromStorage();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUserFromStorage();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      setIsAuth(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuth,
        setUser,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
