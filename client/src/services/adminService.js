import api from './api.js';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return api.get(`/admin/users${qs ? `?${qs}` : ''}`);
  },
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleBlockUser: (id) => api.put(`/admin/users/${id}/block`),
  getOrders: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return api.get(`/admin/orders${qs ? `?${qs}` : ''}`);
  },
  updateOrderStatus: (id, status, note) =>
    api.put(`/admin/orders/${id}/status`, { status, note }),
};
