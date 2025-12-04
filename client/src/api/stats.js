import api from './api';

export const statsAPI = {
  getTaskStats: async () => {
    const response = await api.get('/stats/tasks');
    return response.data;
  },

  getActivityStats: async (params = {}) => {
    const response = await api.get('/stats/activity', { params });
    return response.data;
  },
};
