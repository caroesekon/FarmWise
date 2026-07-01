import api from './axios';

export const getProduction = (params) => api.get('/production', { params });
export const recordProduction = (data) => api.post('/production', data);