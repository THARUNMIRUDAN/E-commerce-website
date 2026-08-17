import api from './api.js';

export const recentlyViewedService = {
  get: () => api.get('/recently-viewed'),
  record: (productId) => api.post('/recently-viewed', { productId }),
};
