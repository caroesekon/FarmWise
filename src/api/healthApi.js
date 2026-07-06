import api from './axios';

export const getHealthRecords = (params) => api.get('/health', { params });
export const addHealthRecord = (data) => api.post('/health', data);
export const updateHealthRecord = (id, data) => api.put(`/health/${id}`, data);
export const deleteHealthRecord = (id) => api.delete(`/health/${id}`);