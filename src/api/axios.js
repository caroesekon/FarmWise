import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmwise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('farmwise_token');
      localStorage.removeItem('farmwise_user');
      window.location.href = '/login';
    }

    if (error.response?.status === 403 && error.response?.data?.code === 'TRIAL_EXPIRED') {
      window.location.href = '/trial-expired';
    }

    return Promise.reject(error);
  }
);

export default api;