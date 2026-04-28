import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMessages, sendMessage } from '../../services/chat.service';
import { authService } from '../../services/auth.service';

interface Message {
  _id: string;
  text: string;
  sender: string;
  createdAt: string;
}

export default function ChatDetailScreen() {
  const params = useLocalSearchParams();
  const { id, name, avatarLetter, receiverId: paramReceiverId } = params;
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      setActiveConversationId(id as string);
    }
    if (paramReceiverId) {
      setReceiverId(paramReceiverId as string);
    }
  }, [id, paramReceiverId]);

  useEffect(() => {
    loadUserId();
    const interval = setInterval(fetchMsgs, 5000);
    return () => clearInterval(interval);
  }, [activeConversationId]);

  const loadUserId = async () => {
    try {
      const user = await authService.getProfile();
      if (user) {
        // Handle both _id and id (just in case)
        const userId = user._id || user.id;
        setCurrentUserId(userId);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const fetchMsgs = async () => {
    // We can fetch if we have an active conversation OR a receiver to check against
    const fetchId = activeConversationId || (id === 'new' ? receiverId : id);
    
    if (!fetchId) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await getMessages(fetchId as string);
      setMessages(data);
      
      // Fallback: If receiverId is not in URL, find it from messages
      if (!receiverId && data.length > 0 && currentUserId) {
        const firstMsg = data[0];
        const otherId = firstMsg.sender === currentUserId ? firstMsg.receiver : firstMsg.sender;
        if (otherId) {
          setReceiverId(otherId);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Use either receiverId or activeConversationId
    if (!receiverId && !activeConversationId) {
      return;
    }

    try {
      setIsSending(true);
      const textToSend = inputText.trim();
      setInputText('');

      const response = await sendMessage(
        receiverId as string || undefined,
        textToSend,
        activeConversationId || undefined
      );

      // Update conversation ID for subsequent polls if it was a 'new' chat
      if (response.conversationId) {
        setActiveConversationId(response.conversationId);
      } else if (response.message?.conversationId) {
        setActiveConversationId(response.message.conversationId);
      }

      fetchMsgs(); // Refresh list
    } catch (error: any) {
      console.error('Send error:', error);
      
      // Extract specific error code/message from server response
      const serverError = error.response?.data;
      const errorCode = serverError?.code;
      const serverMsg = serverError?.message;
      const genericMsg = error.toString();
      
      if (error.response?.status === 401 || genericMsg.toLowerCase().includes('token')) {
        Alert.alert('Session Expired', 'Please login again to continue chatting.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login' as any) }
        ]);
      } else if (errorCode === 'CHAT_LIMIT_REACHED' || serverMsg?.toLowerCase().includes('limit reached')) {
        Alert.alert(
          'Chat Limit Reached',
          serverMsg || 'You have reached your daily limit of unique chats. Upgrade your plan for more limits or delete a recent chat to continue.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade Plan', onPress: () => router.push('/subscription' as any) }
          ]
        );
      } else {
        Alert.alert('Message Failed', serverMsg || genericMsg);
      }
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Robust comparison of IDs (handling both object and string representations)
    const isMe = String(item.sender) === String(currentUserId);

    const date = new Date(item.createdAt);
    const timeText = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[styles.messageWrapper, isMe ? styles.meWrapper : styles.otherWrapper]}>
        <View style={styles.messageRow}>
          <View style={[styles.bubble, isMe ? styles.meBubble : styles.otherBubble]}>
            <Text style={[styles.messageText, isMe ? styles.meMessageText : styles.otherMessageText]}>
              {item.text}
            </Text>
            <View style={styles.messageFooter}>
              <Text style={[styles.timeText, isMe ? styles.meTimeText : styles.otherTimeText]}>
                {timeText}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerUser}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter || 'R'}</Text>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{name || 'Ravi Kumar'}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="call-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatArea}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FF9500" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            extraData={currentUserId}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={() => (
              <View style={styles.dateContainer}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>No conversation yet</Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Bottom Input Area */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputOuter}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (isSending || !inputText.trim()) ? styles.sendBtnDisabled : styles.sendBtnActive
              ]}
              onPress={handleSend}
              disabled={isSending || !inputText.trim()}
            >
              {isSending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light background as in screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerBtn: {
    padding: 5,
  },
  headerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEAD1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  headerStatus: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: -2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 8,
  },
  chatArea: {
    flex: 1,
    paddingTop: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 25,
  },
  dateBadge: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  messageWrapper: {
    marginBottom: 10,
    width: '100%',
  },
  meWrapper: {
    alignItems: 'flex-end',
  },
  otherWrapper: {
    alignItems: 'flex-start',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  otherBubble: {
    backgroundColor: '#FFEAD1',
    borderBottomLeftRadius: 4,
  },
  meBubble: {
    backgroundColor: '#FF9500',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  meMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#1A1A1A',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  timeText: {
    fontSize: 11,
  },
  meTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherTimeText: {
    color: '#888',
  },
  statusIcon: {
    marginLeft: 6,
  },
  replyIcon: {
    marginLeft: 10,
    marginBottom: 15,
    transform: [{ scaleX: -1 }], // Flip the undo icon to look like a reply arrow
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    backgroundColor: '#fff',
  },
  inputOuter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  iconBtn: {
    padding: 5,
  },
  sendBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendBtnActive: {
    backgroundColor: '#FF9500',
  },
  sendBtnDisabled: {
    backgroundColor: '#E4E6EB',
  },
});
