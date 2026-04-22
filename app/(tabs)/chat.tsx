import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  avatarLetter: string;
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    lastMessage: 'Yes, I am available tomorrow morni...',
    time: '11:26',
    unreadCount: 2,
    isOnline: true,
    avatarLetter: 'R',
  },
  {
    id: '2',
    name: 'Priya Singh',
    lastMessage: 'Can you deliver by Saturday?',
    time: '10:31',
    avatarLetter: 'P',
  },
  {
    id: '3',
    name: 'Amit Yadav',
    lastMessage: 'What is the total fare to Ranchi?',
    time: '08:31',
    unreadCount: 1,
    isOnline: true,
    avatarLetter: 'A',
  },
  {
    id: '4',
    name: 'Sunita Devi',
    lastMessage: 'Thank you! Will come for measurement.',
    time: 'Yesterday',
    avatarLetter: 'S',
  },
];

const ChatItem = ({ chat }: { chat: Chat }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push({
        pathname: `/chat/${chat.id}`,
        params: {
          name: chat.name,
          avatarLetter: chat.avatarLetter
        }
      } as any)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{chat.avatarLetter}</Text>
        </View>
        {chat.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{chat.name}</Text>
          <Text style={[styles.timeText, chat.unreadCount ? styles.activeTimeText : null]}>
            {chat.time}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          {chat.unreadCount && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Messages Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem chat={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FDF2E9', // Very light orange/white
  },
  headerBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 18,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEAD1', // Light orange background
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500', // Brand orange
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  activeTimeText: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#FF9500',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 90, // Align with the start of the text
  },
});
