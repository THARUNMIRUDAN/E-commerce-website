import api from './api.js';

export const orderService = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
};
