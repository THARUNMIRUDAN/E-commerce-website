import api from './api.js';

export const reviewService = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  checkEligibility: (productId) => api.get(`/reviews/product/${productId}/eligibility`),
  create: (data) => api.post('/reviews', data),
};
