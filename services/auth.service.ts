import { api } from './api';
import { tokenStorage } from './tokenStorage';
import type { LoginCredentials, SignUpCredentials } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);

    const { accessToken, refreshToken, user } = response.data;

    await tokenStorage.setTokens(accessToken, refreshToken);

    return user;
  },

  async signUp(credentials: SignUpCredentials) {
    const response = await api.post('/auth/register', credentials);

    const { accessToken, refreshToken, user } = response.data;

    await tokenStorage.setTokens(accessToken, refreshToken);

    return user;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      await tokenStorage.clear();
    }
  },

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  async updateProfile(data: { name: string; phone: string; bio?: string; location?: string }) {
    const response = await api.patch('/auth/me', data);
    return response.data.user;
  },
};
