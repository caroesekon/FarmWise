import api from './axios';

export const getWeather = async () => {
  const token = localStorage.getItem('farmwise_token');
  if (!token) throw new Error('Not authenticated');
  return api.get('/weather');
};