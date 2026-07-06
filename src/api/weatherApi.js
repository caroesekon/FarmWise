import api from './axios';

export const getWeather = () => api.get('/weather');
export const getForecast = (days = 7) => api.get('/weather/forecast', { params: { days } });
export const getSeasonal = () => api.get('/weather/seasonal');