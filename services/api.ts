import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.zylo.app/api';

export default async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await AsyncStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}
