import api from './axios';

export const getHealthRecords = (params) => api.get('/health', { params });
export const addHealthRecord = (data) => api.post('/health', data);