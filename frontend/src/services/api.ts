import axios from 'axios';
import { ApiResponse } from '../types';

// 动态确定API基础URL
const getApiBaseUrl = () => {
  // 如果设置了环境变量，使用环境变量
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 开发模式下的动态配置
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  // 如果通过3000或9999端口访问，直接连接后端API
  if (currentPort === '3000' || currentPort === '9999') {
    return 'http://localhost:3001/api/v1';
  }
  
  // 如果通过80端口（nginx代理）访问，使用相对路径
  return '/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Channels API
  channels: {
    getAll: (params?: any) => apiClient.get('/channels', { params }),
    getById: (id: number) => apiClient.get(`/channels/${id}`),
    create: (data: any) => apiClient.post('/channels', data),
    update: (id: number, data: any) => apiClient.put(`/channels/${id}`, data),
    delete: (id: number) => apiClient.delete(`/channels/${id}`),
  },

  // Campaigns API
  campaigns: {
    getAll: (params?: any) => apiClient.get('/campaigns', { params }),
    getById: (id: number) => apiClient.get(`/campaigns/${id}`),
    getGoals: () => apiClient.get('/campaigns/goals'),
    create: (data: any) => apiClient.post('/campaigns', data),
    update: (id: number, data: any) => apiClient.put(`/campaigns/${id}`, data),
    delete: (id: number) => apiClient.delete(`/campaigns/${id}`),
  },

  // Events API
  events: {
    getAll: (params?: any) => apiClient.get('/events', { params }),
    getById: (id: number) => apiClient.get(`/events/${id}`),
    create: (data: any) => apiClient.post('/events', data),
    getAnalytics: (params?: any) => apiClient.get('/events/analytics', { params }),
  },

  // Funnels API
  funnels: {
    getAll: (params?: any) => apiClient.get('/funnels', { params }),
    getById: (id: number) => apiClient.get(`/funnels/${id}`),
    getAnalytics: (id: number, params?: any) => apiClient.get(`/funnels/${id}/analytics`, { params }),
    create: (data: any) => apiClient.post('/funnels', data),
    update: (id: number, data: any) => apiClient.put(`/funnels/${id}`, data),
    delete: (id: number) => apiClient.delete(`/funnels/${id}`),
  },
};

export default apiClient;