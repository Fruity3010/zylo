import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  getMessages,
  sendMessage,
  sendImageMessage,
  markMessagesAsRead,
  subscribeToMessages,
  unsubscribeFromMessages,
  pickImage,
  takePhoto,
  type Message,
} from '../../services/chat';
import { getCurrentUserFromStorage } from '../../services/auth';

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    loadMessages();
    setupRealtime();

    return () => {
      if (channelRef.current) {
        unsubscribeFromMessages(channelRef.current);
      }
    };
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const user = await getCurrentUserFromStorage();
      if (user) {
        setCurrentUserId(user.id);
      }

      const response = await getMessages(conversationId as string);

      if (response.success && response.data) {
        setMessages(response.data.messages);
        await markMessagesAsRead(conversationId as string);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    channelRef.current = subscribeToMessages(
      conversationId as string,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
        if (newMessage.sender_id !== currentUserId) {
          markMessagesAsRead(conversationId as string);
        }
      }
    );
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const response = await sendMessage(conversationId as string, messageText);

      if (!response.success) {
        Alert.alert('Error', 'Failed to send message');
        setInputText(messageText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setInputText(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Send Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => handleSendImage('camera'),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => handleSendImage('gallery'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSendImage = async (source: 'camera' | 'gallery') => {
    setSending(true);

    try {
      const imageUri = source === 'camera' ? await takePhoto() : await pickImage();

      if (!imageUri) {
        setSending(false);
        return;
      }

      const response = await sendImageMessage(
        conversationId as string,
        imageUri,
        'Sent an image'
      );

      if (!response.success) {
        Alert.alert('Error', 'Failed to send image');
      }
    } catch (error) {
      console.error('Error sending image:', error);
      Alert.alert('Error', 'Failed to send image');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender_id === currentUserId;
    const isSystemMessage = item.message_type === 'system';

    if (isSystemMessage) {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{item.content}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!isMyMessage && (
          <Text style={styles.senderName}>{item.sender?.full_name}</Text>
        )}

        {item.message_type === 'image' && item.image_url && (
          <Image
            source={{ uri: item.image_url }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}

        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText,
          ]}
        >
          {item.content}
        </Text>

        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6AFF6A" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.imageButton}
          disabled={sending}
        >
          <Text style={styles.imageButtonText}>📷</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          multiline
          maxLength={1000}
          editable={!sending}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            (!inputText.trim() || sending) && styles.sendButtonDisabled,
          ]}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  messageList: {
    padding: 15,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6AFF6A',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2C2C2C',
  },
  senderName: {
    fontSize: 12,
    color: '#6AFF6A',
    marginBottom: 4,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#000',
  },
  theirMessageText: {
    color: '#fff',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#181F20',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  imageButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  imageButtonText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6AFF6A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
