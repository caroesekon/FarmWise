import api from './axios';

export const getInventory = (params) => api.get('/inventory', { params });
export const addItem = (data) => api.post('/inventory', data);
export const updateStock = (id, data) => api.put(`/inventory/${id}/stock`, data);
export const deleteItem = (id) => api.delete(`/inventory/${id}`);