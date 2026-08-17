import api from './api.js';

export const productService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return api.get(`/products${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};
