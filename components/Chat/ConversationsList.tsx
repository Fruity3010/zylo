import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  getConversations,
  subscribeToConversations,
  unsubscribeFromMessages,
  type Conversation,
} from '../../services/chat';
import { getCurrentUserFromStorage } from '../../services/auth';

export default function ConversationsList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const router = useRouter();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    loadConversations();
    setupRealtime();

    return () => {
      if (channelRef.current) {
        unsubscribeFromMessages(channelRef.current);
      }
    };
  }, []);

  const loadConversations = async () => {
    try {
      const user = await getCurrentUserFromStorage();
      if (user) {
        setCurrentUserId(user.id);
      }

      const response = await getConversations();

      if (response.success && response.data) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setupRealtime = async () => {
    const user = await getCurrentUserFromStorage();
    if (!user) return;

    channelRef.current = subscribeToConversations(user.id, () => {
      loadConversations();
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const handleConversationPress = (conversation: Conversation) => {
    router.push(`/chat/${conversation.id}`);
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const isCurrentUserSender = item.sender_id === currentUserId;
    const otherUserName = isCurrentUserSender ? item.errander_name : item.sender_name;
    const otherUserAvatar = isCurrentUserSender ? item.errander_avatar : item.sender_avatar;
    const hasUnread = (item.unread_count || 0) > 0;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item)}
      >
        <View style={styles.avatarContainer}>
          {otherUserAvatar ? (
            <Image source={{ uri: otherUserAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {otherUserName?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {hasUnread && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName} numberOfLines={1}>
              {otherUserName}
            </Text>
            {item.last_message_at && (
              <Text style={styles.timestamp}>
                {formatTimestamp(item.last_message_at)}
              </Text>
            )}
          </View>

          <Text style={styles.errandTitle} numberOfLines={1}>
            📦 {item.errand_title}
          </Text>

          {item.last_message && (
            <View style={styles.lastMessageContainer}>
              <Text
                style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]}
                numberOfLines={1}
              >
                {item.last_message}
              </Text>
              {hasUnread && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unread_count}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6AFF6A" />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6AFF6A"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>
              Conversations will appear here when you accept an errand
            </Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#181F20',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6AFF6A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4444',
    borderWidth: 2,
    borderColor: '#181F20',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  errandTitle: {
    fontSize: 14,
    color: '#6AFF6A',
    marginBottom: 4,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  lastMessageUnread: {
    color: '#fff',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#6AFF6A',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
