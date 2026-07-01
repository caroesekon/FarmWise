import api from './axios';

export const getBreedingRecords = (params) => api.get('/breeding', { params });
export const addBreedingEvent = (data) => api.post('/breeding', data);
export const updateBreedingEvent = (id, data) => api.put(`/breeding/${id}`, data);