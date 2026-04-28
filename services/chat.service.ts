import { api } from './api';

export const sendMessage = async (receiverId?: string, text?: string, conversationId?: string) => {
  try {
    const response = await api.post('/chat/send', { receiverId, text, conversationId });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to send message';
  }
};

export const checkChatLimit = async (receiverId: string) => {
  try {
    const response = await api.get(`/chat/check-limit/${receiverId}`);
    return response.data;
  } catch (error: any) {
    // Return the response data if available so we can check for error codes
    throw error.response?.data || error.message || 'Failed to check chat limit';
  }
};

export const getConversations = async () => {
  try {
    const response = await api.get('/chat/conversations');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch conversations';
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch messages';
  }
};
