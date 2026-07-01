import api from './axios';

export const getVaccinations = (params) => api.get('/vaccinations', { params });
export const getVets = () => api.get('/vaccinations/vets');
export const scheduleVaccination = (data) => api.post('/vaccinations', data);
export const completeVaccination = (id, data) => api.put(`/vaccinations/${id}/complete`, data);