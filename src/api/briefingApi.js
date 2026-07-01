import api from './axios';

export const getBriefing = () => api.get('/briefing');