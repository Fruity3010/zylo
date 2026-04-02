import api from './api';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Errand {
  id: string;
  sender_id: string;
  errander_id?: string;
  category: 'fuel_energy' | 'courier_delivery' | 'office_work' | 'custom';
  title: string;
  description: string;
  budget: number;
  pickup_location?: Location;
  destination_location: Location;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  image_urls?: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  sender?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
  errander?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateErrandData {
  category: 'fuel_energy' | 'courier_delivery' | 'office_work' | 'custom';
  title: string;
  description: string;
  budget: number;
  pickup_location?: Location;
  destination_location: Location;
  image_urls?: string[];
}

export interface ErrandFilters {
  status?: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  category?: 'fuel_energy' | 'courier_delivery' | 'office_work' | 'custom';
  sender_id?: string;
  errander_id?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Create a new errand
 */
export const createErrand = async (data: CreateErrandData): Promise<ApiResponse<{ errand: Errand }>> => {
  try {
    const response = await api.post<ApiResponse<{ errand: Errand }>>('/errands', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create errand',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get all errands with optional filters
 */
export const getErrands = async (filters?: ErrandFilters): Promise<ApiResponse<{ errands: Errand[] }>> => {
  try {
    const response = await api.get<ApiResponse<{ errands: Errand[] }>>('/errands', {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch errands',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get a single errand by ID
 */
export const getErrandById = async (id: string): Promise<ApiResponse<{ errand: Errand }>> => {
  try {
    const response = await api.get<ApiResponse<{ errand: Errand }>>(`/errands/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch errand',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Update an errand
 */
export const updateErrand = async (
  id: string,
  updates: Partial<CreateErrandData>
): Promise<ApiResponse<{ errand: Errand }>> => {
  try {
    const response = await api.patch<ApiResponse<{ errand: Errand }>>(`/errands/${id}`, updates);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update errand',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Delete an errand
 */
export const deleteErrand = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete<ApiResponse>(`/errands/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete errand',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Apply to an errand (errander)
 */
export const applyToErrand = async (id: string): Promise<ApiResponse<{ errand: Errand }>> => {
  try {
    const response = await api.post<ApiResponse<{ errand: Errand }>>(`/errands/${id}/apply`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to apply to errand',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get user's posted errands (as sender)
 */
export const getMyPostedErrands = async (): Promise<ApiResponse<{ errands: Errand[] }>> => {
  // This will be filtered on the client side after fetching current user
  return getErrands();
};

/**
 * Get errands assigned to user (as errander)
 */
export const getMyAssignedErrands = async (): Promise<ApiResponse<{ errands: Errand[] }>> => {
  // This will be filtered on the client side after fetching current user
  return getErrands();
};
