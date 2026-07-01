import api from './axios';

export const getEquipment = (params) => api.get('/equipment', { params });
export const addEquipment = (data) => api.post('/equipment', data);
export const logMaintenance = (id, data) => api.post(`/equipment/${id}/maintenance`, data);