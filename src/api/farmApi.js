import api from './axios';

export const getFarm = () => api.get('/farm');
export const updateFarm = (data) => api.put('/farm', data);
export const getPrices = () => api.get('/farm/prices');
export const updatePrices = (data) => api.put('/farm/prices', data);
export const getProducts = () => api.get('/farm/products');