import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ShoppingBag, Eye, Calendar } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { adminService } from '../../services/adminService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { useToast } from '../../context/ToastContext.jsx';

const statusOptions = [
  'Pending',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({
        keyword,
        status: statusFilter,
        page,
        limit: 10,
      });
      setOrders(res.orders || []);
      setPages(res.pages || 1);
      setTotalOrders(res.totalOrders || 0);
    } catch (error) {
      console.error('[AdminOrders] Error:', error.message);
      showToast('Error loading orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, page, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (error) {
      showToast(error.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Order Operations</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review customer shipments, update fulfillment workflows, and manage transactions ({totalOrders} orders).
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-main)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Search by Order ID (e.g. RV10294) or customer name..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search
            size={18}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="form-select"
            style={{ width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-main)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {loading ? (
          <Loader message="Fetching store orders..." />
        ) : orders.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <ShoppingBag size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No orders found matching your query.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-main)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Order ID</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Customer & Destination</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Total</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status Control</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ color: 'var(--primary-900)', display: 'block' }}>
                        #{order.orderCode}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.orderItems.length} item{order.orderItems.length === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                        {order.shippingAddress.fullName}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode} • {order.shippingAddress.phone}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--text-light)" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <strong style={{ color: 'var(--primary-900)', fontSize: '0.95rem' }}>
                        {formatCurrency(order.totalPrice)}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem' }}>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="form-select"
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor:
                            order.orderStatus === 'Delivered'
                              ? 'var(--emerald-50)'
                              : order.orderStatus === 'Cancelled'
                              ? '#fee2e2'
                              : 'var(--bg-subtle)',
                          color:
                            order.orderStatus === 'Delivered'
                              ? '#047857'
                              : order.orderStatus === 'Cancelled'
                              ? '#dc2626'
                              : 'var(--text-main)',
                        }}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '1rem' }}>
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
