import api from './api';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// Supabase client for Realtime and Storage
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // TODO: Move to env config
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // TODO: Move to env config

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'system';
  content: string;
  image_url?: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  errand_id: string;
  sender_id: string;
  errander_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  errand_title?: string;
  errand_status?: string;
  sender_name?: string;
  sender_avatar?: string;
  errander_name?: string;
  errander_avatar?: string;
  unread_count?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Get all conversations for current user
 */
export const getConversations = async (): Promise<ApiResponse<{ conversations: Conversation[] }>> => {
  try {
    const response = await api.get<ApiResponse<{ conversations: Conversation[] }>>('/chat/conversations');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch conversations',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get conversation by errand ID
 */
export const getConversationByErrand = async (errandId: string): Promise<ApiResponse<{ conversation: Conversation }>> => {
  try {
    const response = await api.get<ApiResponse<{ conversation: Conversation }>>(
      `/chat/conversations/errand/${errandId}`
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch conversation',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (
  conversationId: string,
  limit = 50,
  before?: string
): Promise<ApiResponse<{ messages: Message[] }>> => {
  try {
    const params: any = { limit };
    if (before) params.before = before;

    const response = await api.get<ApiResponse<{ messages: Message[] }>>(
      `/chat/conversations/${conversationId}/messages`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch messages',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Send a text message
 */
export const sendMessage = async (
  conversationId: string,
  content: string
): Promise<ApiResponse<{ message: Message }>> => {
  try {
    const response = await api.post<ApiResponse<{ message: Message }>>(
      `/chat/conversations/${conversationId}/messages`,
      {
        content,
        message_type: 'text',
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send message',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Send an image message
 */
export const sendImageMessage = async (
  conversationId: string,
  imageUri: string,
  caption: string = 'Sent an image'
): Promise<ApiResponse<{ message: Message }>> => {
  try {
    // First, upload image to Supabase Storage
    const imageUrl = await uploadChatImage(imageUri);

    if (!imageUrl) {
      return {
        success: false,
        message: 'Failed to upload image',
      };
    }

    // Then send message with image URL
    const response = await api.post<ApiResponse<{ message: Message }>>(
      `/chat/conversations/${conversationId}/messages`,
      {
        content: caption,
        message_type: 'image',
        image_url: imageUrl,
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send image',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Upload image to Supabase Storage
 */
export const uploadChatImage = async (imageUri: string): Promise<string | null> => {
  try {
    // Get auth token
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Set session for Supabase client
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) {
      throw new Error('Invalid session');
    }

    // Convert image to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Generate unique filename
    const fileExt = imageUri.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from('chat-images')
      .upload(filePath, blob, {
        contentType: `image/${fileExt}`,
        cacheControl: '3600',
      });

    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('chat-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (conversationId: string): Promise<ApiResponse> => {
  try {
    const response = await api.patch<ApiResponse>(
      `/chat/conversations/${conversationId}/read`
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark messages as read',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Subscribe to new messages in a conversation (Realtime)
 */
export const subscribeToMessages = (
  conversationId: string,
  onNewMessage: (message: Message) => void
) => {
  const channel = supabaseClient
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      async (payload) => {
        // Fetch full message details with sender info
        const { data } = await supabaseClient
          .from('messages')
          .select('*, sender:users!sender_id(id, full_name, avatar_url)')
          .eq('id', payload.new.id)
          .single();

        if (data) {
          onNewMessage(data as Message);
        }
      }
    )
    .subscribe();

  return channel;
};

/**
 * Unsubscribe from messages
 */
export const unsubscribeFromMessages = (channel: any) => {
  if (channel) {
    supabaseClient.removeChannel(channel);
  }
};

/**
 * Subscribe to conversation updates (for conversation list)
 */
export const subscribeToConversations = (
  userId: string,
  onUpdate: () => void
) => {
  const channel = supabaseClient
    .channel('conversations')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `sender_id=eq.${userId}`,
      },
      () => onUpdate()
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `errander_id=eq.${userId}`,
      },
      () => onUpdate()
    )
    .subscribe();

  return channel;
};

/**
 * Pick image from gallery
 */
export const pickImage = async (): Promise<string | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images!');
      return null;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

/**
 * Take photo with camera
 */
export const takePhoto = async (): Promise<string | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to take photos!');
      return null;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};
