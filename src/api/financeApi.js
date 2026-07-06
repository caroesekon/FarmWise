import api from './axios';

export const getFinances = (params) => api.get('/finance', { params });
export const addRecord = (data) => api.post('/finance', data);
export const updateRecord = (id, data) => api.put(`/finance/${id}`, data);
export const deleteRecord = (id) => api.delete(`/finance/${id}`);