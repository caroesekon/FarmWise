import api from './axios';

export const getAnimals = (params) => api.get('/animals', { params });
export const getAnimal = (id) => api.get(`/animals/${id}`);
export const createAnimal = (data) => api.post('/animals', data);
export const updateAnimal = (id, data) => api.put(`/animals/${id}`, data);
export const createBatch = (data) => api.post('/animals/batch', data);
export const getBatches = () => api.get('/animals/batches');
export const deleteAnimal = (id) => api.delete(`/animals/${id}`);