import { api } from './api';

export const subscribeToPlan = async (planData: {
  plan: string;
  billingCycle: string;
  amount: number;
}) => {
  try {
    const response = await api.post('/subscription/subscribe', planData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to subscribe';
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const response = await api.get('/subscription/status');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch subscription status';
  }
};
