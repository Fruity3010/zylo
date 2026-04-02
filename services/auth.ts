import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  role: 'sender' | 'errander' | 'both';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'sender' | 'errander' | 'both';
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    session: {
      access_token: string;
      refresh_token: string;
      expires_at?: number;
    };
  };
  error?: string;
}

/**
 * Sign up a new user
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  try {
    console.log('Making signup API request to:', '/auth/signup');
    console.log('Signup data:', data);

    const response = await api.post<AuthResponse>('/auth/signup', data);

    console.log('Signup API response:', response.data);

    if (response.data.success && response.data.data) {
      // Store token and user data
      await AsyncStorage.setItem('auth_token', response.data.data.session.access_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error: any) {
    console.error('Signup API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });

    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Signup failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', data);

    if (response.data.success && response.data.data) {
      // Store token and user data
      await AsyncStorage.setItem('auth_token', response.data.data.session.access_token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }
};

/**
 * Get current user from storage
 */
export const getCurrentUserFromStorage = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};

/**
 * Get current user from API
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<AuthResponse>('/auth/me');

    if (response.data.success && response.data.data) {
      // Update stored user data
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data.user));
      return response.data.data.user;
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  } catch (error) {
    return false;
  }
};
