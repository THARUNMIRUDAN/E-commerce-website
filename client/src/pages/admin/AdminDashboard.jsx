import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  Layers,
  ShoppingBag,
  Clock,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { adminService } from '../../services/adminService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getStats();
        setData(res);
      } catch (error) {
        console.error('[AdminDashboard] Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader fullScreen message="Loading store intelligence..." />;
  }

  const { metrics, recentOrders = [], topProducts = [], recentUsers = [], lowStockProducts = [] } = data || {};

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Store Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Real-time metrics, order activities, and inventory status.
        </p>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics?.totalRevenue || 0)}
          icon={IndianRupee}
          color="#047857"
          bg="var(--emerald-50)"
        />
        <StatCard
          title="Total Orders"
          value={metrics?.totalOrders || 0}
          icon={ShoppingBag}
          color="var(--primary-900)"
          bg="var(--bg-subtle)"
        />
        <StatCard
          title="Pending Orders"
          value={metrics?.pendingOrders || 0}
          icon={Clock}
          color="#b45309"
          bg="var(--amber-50)"
        />
        <StatCard
          title="Active Products"
          value={metrics?.totalProducts || 0}
          icon={Package}
          color="var(--accent-600)"
          bg="var(--accent-50)"
        />
        <StatCard
          title="Registered Users"
          value={metrics?.totalUsers || 0}
          icon={Users}
          color="#0284c7"
          bg="#f0f9ff"
        />
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="#d97706" />
            <div>
              <strong style={{ color: '#92400e', fontSize: '0.95rem' }}>
                Inventory Alert: {lowStockProducts.length} Product{lowStockProducts.length > 1 ? 's' : ''} Low on Stock
              </strong>
              <p style={{ color: '#b45309', fontSize: '0.85rem' }}>
                {lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(', ')}
              </p>
            </div>
          </div>
          <Link to="/admin/products" className="btn btn-outline btn-sm" style={{ borderColor: '#d97706', color: '#92400e' }}>
            Manage Stock
          </Link>
        </div>
      )}

      {/* Dual Section Grid: Recent Orders + Top Products */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Recent Orders Table */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-main)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h4 style={{ fontWeight: 800 }}>Recent Orders</h4>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--accent-600)', fontWeight: 600 }}>
              View All <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0', color: 'var(--text-muted)' }}>Order ID</th>
                  <th style={{ padding: '0.6rem 0', color: 'var(--text-muted)' }}>Customer</th>
                  <th style={{ padding: '0.6rem 0', color: 'var(--text-muted)' }}>Total</th>
                  <th style={{ padding: '0.6rem 0', color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 700 }}>#{ord.orderCode}</td>
                    <td style={{ padding: '0.75rem 0' }}>{ord.user?.name || ord.shippingAddress.fullName}</td>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{formatCurrency(ord.totalPrice)}</td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-main)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h4 style={{ fontWeight: 800 }}>Top Selling Products</h4>
            <Link to="/admin/products" style={{ fontSize: '0.85rem', color: 'var(--accent-600)', fontWeight: 600 }}>
              All Products
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No product sales recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {topProducts.map((prod) => (
                <div
                  key={prod._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                      alt={prod.name}
                      style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {prod.name}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <strong style={{ fontSize: '0.875rem', display: 'block' }}>{prod.totalSold} sold</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatCurrency(prod.totalSales)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
