import api from './axios';

export const getProduction = (params) => api.get('/production', { params });
export const recordProduction = (data) => api.post('/production', data);
export const updateProduction = (id, data) => api.put(`/production/${id}`, data);
export const deleteProduction = (id) => api.delete(`/production/${id}`);