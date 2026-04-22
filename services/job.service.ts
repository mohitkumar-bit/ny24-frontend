import { api } from './api';

export interface JobPost {
  _id: string;
  title: string;
  description: string;
  categories: any[];
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  author: any;
  status: string;
  createdAt: string;
}

export const jobService = {
  async createJob(data: any) {
    const response = await api.post('/job', data);
    return response.data;
  },

  async getJobs(params?: any): Promise<JobPost[]> {
    const response = await api.get('/job', { params });
    return response.data;
  },

  async getJobById(id: string): Promise<JobPost> {
    const response = await api.get(`/job/${id}`);
    return response.data;
  },

  async getMyJobs(): Promise<JobPost[]> {
    const response = await api.get('/job/me');
    return response.data;
  },

  async updateJob(id: string, data: any) {
    const response = await api.put(`/job/${id}`, data);
    return response.data;
  },

  async deleteJob(id: string) {
    const response = await api.delete(`/job/${id}`);
    return response.data;
  },
};
