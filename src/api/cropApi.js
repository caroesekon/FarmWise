import api from './axios';

export const getCrops = (params) => api.get('/crops', { params });
export const addCrop = (data) => api.post('/crops', data);
export const harvestCrop = (id, data) => api.put(`/crops/${id}/harvest`, data);