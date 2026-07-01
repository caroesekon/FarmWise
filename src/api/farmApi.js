import api from './axios';

export const getFarm = () => api.get('/farm');
export const updateFarm = (data) => api.put('/farm', data);