import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import Loader from '../components/common/Loader.jsx';
import { orderService } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'badge-success';
    case 'Shipped':
    case 'Out for Delivery':
      return 'badge-primary';
    case 'Confirmed':
      return 'badge-secondary';
    case 'Cancelled':
      return 'badge-warning';
    default:
      return 'badge-secondary';
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (error) {
        console.error('[MyOrders] Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Loader fullScreen message="Loading your order history..." />;
  }

  return (
    <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
            <Package size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Account Activity
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>My Orders</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track deliveries, view previous purchases, and manage orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              padding: '5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px dashed var(--border-main)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--primary-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontWeight: 700 }}>No Orders Found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px' }}>
              You haven't placed any orders yet. Discover our curated collection and make your first purchase!
            </p>
            <Link to="/shop" className="btn btn-primary btn-md">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-main)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order ID</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--primary-900)' }}>#{order.orderCode}</strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Placed On</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        <Calendar size={13} color="var(--text-muted)" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--primary-900)' }}>
                        {formatCurrency(order.totalPrice)}
                      </strong>
                    </div>
                  </div>

                  <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`} style={{ padding: '0.35rem 0.85rem' }}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items preview row */}
                <div
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '64px', height: '64px' }}>
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid var(--border-main)',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            backgroundColor: 'var(--primary-900)',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link to={`/my-orders/${order._id}`} className="btn btn-outline btn-sm">
                    View Details & Tracking <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
