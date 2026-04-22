import { api } from './api';

export const workerService = {
  async createProfile(data: any) {
    const response = await api.post('/worker/create-profile', data);
    return response.data;
  },

  async searchWorkers(params?: any) {
    const response = await api.get('/worker/search', { params });
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get('/worker/my-profile');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put('/worker/update-profile', data);
    return response.data;
  },
};
