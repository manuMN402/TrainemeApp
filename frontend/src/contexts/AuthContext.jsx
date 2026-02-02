import React, { createContext, useContext, useState, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);

  /**
   * Save token to local storage
   */
  const saveToken = useCallback(async (authToken) => {
    try {
      await AsyncStorage.setItem('authToken', authToken);
      setToken(authToken);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }, []);

  /**
   * Get token from local storage
   */
  const getToken = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        return storedToken;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return null;
  }, []);

  /**
   * Clear token and user data
   */
  const clearToken = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }, []);

  /**
   * Register user
   */
  const register = useCallback(async (registrationData) => {
    console.log('[AuthContext] Register called with data:', registrationData);
    setLoading(true);
    try {
      console.log('[AuthContext] Calling API register...');
      const response = await api.auth.register(registrationData);
      
      console.log('[AuthContext] API response received:', response);

      if (!response) {
        throw new Error('No response from registration endpoint');
      }

      if (!response.token) {
        throw new Error('No authentication token in response');
      }

      if (!response.user) {
        throw new Error('No user data in response');
      }

      console.log('[AuthContext] Saving token and user...');
      await saveToken(response.token);
      setUser(response.user);

      console.log('[AuthContext] Registration successful');
      return response;
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      console.error('[AuthContext] Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
      });
      throw error;
    } finally {
      console.log('[AuthContext] Setting loading to false');
      setLoading(false);
    }
  }, [saveToken]);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      if (response.token && response.user) {
        await saveToken(response.token);
        setUser(response.user);
        return response;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [saveToken]);

  /**
   * Get current user profile
   */
  const getProfile = useCallback(async (authToken = null) => {
    setLoading(true);
    try {
      const currentToken = authToken || token;
      if (!currentToken) {
        throw new Error('No authentication token available');
      }

      const response = await api.auth.getProfile(currentToken);
      setUser(response);
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await api.auth.updateProfile(profileData, token);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    await clearToken();
  }, [clearToken]);

  /**
   * Initialize auth (restore token from storage)
   */
  const initializeAuth = useCallback(async () => {
    setLoading(true);
    try {
      const storedToken = await getToken();
      if (storedToken) {
        // Verify token is still valid by getting profile
        try {
          const userProfile = await api.auth.getProfile(storedToken);
          setUser(userProfile);
        } catch (error) {
          // Token is invalid, clear it
          await clearToken();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken, clearToken]);

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    initializeAuth,
    saveToken,
    getToken,
    clearToken,
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
