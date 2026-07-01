import api from './axios';

export const chat = (data) => api.post('/ai/chat', data);