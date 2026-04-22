import React, { useState } from 'react';
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
  Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'other' | 'me';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'Hello! I saw your post and I am interested.', sender: 'other', time: '15:48', status: 'read' },
  { id: '2', text: 'Hi! Thanks for reaching out. How can I help you?', sender: 'me', time: '15:50' },
  { id: '3', text: 'I need the work done by this weekend. Is that possible?', sender: 'other', time: '15:53', status: 'read' },
  { id: '4', text: 'Yes, I am available on Saturday. Shall we confirm a time?', sender: 'me', time: '15:56' },
  { id: '5', text: 'Saturday 10 AM works for me. What is your rate?', sender: 'other', time: '16:08' },
];

export default function ChatDetailScreen() {
  const { id, name, avatarLetter } = useLocalSearchParams();
  const router = useRouter();
  const [inputText, setInputText] = useState('');

  const renderMessage = ({ item }: { item: Message }) => {
    const isOther = item.sender === 'other';
    return (
      <View style={styles.messageWrapper}>
        <View style={styles.messageRow}>
          {!isOther && (
            <View style={styles.miniAvatar}>
              <Text style={styles.miniAvatarText}>s</Text>
            </View>
          )}
          <View style={[styles.bubble, isOther ? styles.otherBubble : styles.meBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <View style={styles.messageFooter}>
              <Text style={styles.timeText}>{item.time}</Text>
              {isOther && (
                <Ionicons
                  name="checkmark-done"
                  size={16}
                  color="#34B7F1"
                  style={styles.statusIcon}
                />
              )}
            </View>
          </View>
          {/* Reply Arrow Placeholder */}
          <Ionicons name="arrow-undo-outline" size={16} color="#BDBDBD" style={styles.replyIcon} />
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
        <FlatList
          data={MOCK_MESSAGES}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <View style={styles.dateContainer}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>Today</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />

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
              />
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="happy-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" />
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
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '90%',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFEAD1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 5,
  },
  miniAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    maxWidth: 295
  },
  otherBubble: {
    backgroundColor: '#FFEAD1', // Tan/Orange from screenshot
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 5,
  },
  meBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
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
    backgroundColor: '#E4E6EB', // Grey as in screenshot
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
