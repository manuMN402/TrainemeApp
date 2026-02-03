import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/apiService';

/**
 * Authentication Context
 * Manages user authentication state and token storage
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Save token & user to local storage
   */
  const saveAuth = useCallback(async (authToken, authUser) => {
    try {
      await AsyncStorage.multiSet([
        ['authToken', authToken],
        ['authUser', JSON.stringify(authUser)],
      ]);
      setToken(authToken);
      setUser(authUser);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }, []);

  /**
   * Load auth data from storage
   * Returns an object { token, user } and also hydrates context state.
   */
  const loadAuth = useCallback(async () => {
    try {
      const [[, storedToken], [, storedUser]] = await AsyncStorage.multiGet([
        'authToken',
        'authUser',
      ]);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        return { token: storedToken, user: parsedUser };
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }

    return { token: null, user: null };
  }, []);

  /**
   * Clear token and user data
   */
  const clearAuth = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'authUser']);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }, []);

  /**
   * Register user
   */
  const register = useCallback(async (registrationData) => {
    setLoading(true);
    try {
      const response = await api.auth.register(registrationData);

      if (!response?.token || !response?.user) {
        throw new Error('Invalid registration response');
      }

      await saveAuth(response.token, response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await api.auth.login({ email, password });

      if (!response?.token || !response?.user) {
        throw new Error('Invalid login response');
      }

      await saveAuth(response.token, response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, [saveAuth]);

  /**
   * Get current user profile
   */
  const getProfile = useCallback(async () => {
    if (!token) throw new Error('No authentication token available');
    const profile = await api.auth.getProfile(token);
    setUser(profile);
    return profile;
  }, [token]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profileData) => {
    if (!token) throw new Error('No authentication token available');
    const response = await api.auth.updateProfile(profileData, token);
    setUser(response.user);
    return response;
  }, [token]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    await clearAuth();
  }, [clearAuth]);

  /**
   * Initialize auth on app start
   */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { token: storedToken, user: storedUser } = await loadAuth();
        if (!storedToken) return;

        // If this is a locally-generated mock token, trust the stored user and
        // skip the network profile check (prevents 401s for dev/mock tokens).
        if (storedToken.startsWith && storedToken.startsWith('token-') && storedUser) {
          console.log('Auth init: detected mock token — trusting stored user');
          // ensure the user in context is the stored user (loadAuth already set it)
          setUser(storedUser);
          return;
        }

        try {
          const profile = await api.auth.getProfile(storedToken);
          setUser(profile);
        } catch (err) {
          // If backend returned 401 for a mock-like token, fallback to stored user
          if (err?.status === 401 && storedToken.startsWith && storedToken.startsWith('token-') && storedUser) {
            console.warn('Profile fetch returned 401 for mock token — using stored user as fallback');
            setUser(storedUser);
            return;
          }

          // For real tokens, clear auth so app shows the unauthenticated flow
          console.warn('Auth init: profile validation failed, clearing stored auth', err?.message || err);
          await clearAuth();
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [loadAuth, clearAuth]);

  /**
   * Set auth (useful for mock flows / testing)
   * Ensures token + user are persisted and context is updated.
   */
  const setAuth = useCallback(async (authToken, authUser) => {
    await saveAuth(authToken, authUser);
  }, [saveAuth]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    // public helper for tests / mock flows
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
