import api from './axios';

export const getTeam = () => api.get('/team');
export const addMember = (data) => api.post('/team', data);
export const removeMember = (id) => api.delete(`/team/${id}`);