import api from './axios';

export const getFinances = (params) => api.get('/finance', { params });
export const addRecord = (data) => api.post('/finance', data);
export const deleteRecord = (id) => api.delete(`/finance/${id}`);