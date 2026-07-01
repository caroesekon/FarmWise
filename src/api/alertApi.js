import api from './axios';

export const getAlerts = (params) => api.get('/alerts', { params });
export const acknowledgeAlert = (id) => api.put(`/alerts/${id}/acknowledge`);
export const dismissAlert = (id) => api.put(`/alerts/${id}/dismiss`);