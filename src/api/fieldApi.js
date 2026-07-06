import api from './axios';

export const getFields = (params) => api.get('/fields', { params });
export const addField = (data) => api.post('/fields', data);
export const updateField = (id, data) => api.put(`/fields/${id}`, data);
export const deleteField = (id) => api.delete(`/fields/${id}`);