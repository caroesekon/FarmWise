import api from './axios';

export const getEquipment = (params) => api.get('/equipment', { params });
export const addEquipment = (data) => api.post('/equipment', data);
export const updateEquipment = (id, data) => api.put(`/equipment/${id}`, data);
export const logMaintenance = (id, data) => api.post(`/equipment/${id}/maintenance`, data);
export const deleteEquipment = (id) => api.delete(`/equipment/${id}`);