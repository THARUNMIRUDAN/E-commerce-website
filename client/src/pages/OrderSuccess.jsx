import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import Loader from '../components/common/Loader.jsx';
import { orderService } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getById(id);
        setOrder(data);
      } catch (error) {
        console.error('[OrderSuccess] Error fetching order:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return <Loader fullScreen message="Confirming your order..." />;
  }

  return (
    <div className="section" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '3rem 2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-main)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--emerald-50)',
              color: 'var(--emerald-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircle2 size={42} />
          </div>

          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--emerald-500)',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            Order Placed Successfully
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Thank You For Your Purchase!
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            We have received your order #{order?.orderCode || id}. You will pay{' '}
            <strong>{formatCurrency(order?.totalPrice || 0)}</strong> via Cash on Delivery when it arrives.
          </p>

          {/* Details Card */}
          {order && (
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'left',
                marginBottom: '2rem',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <strong style={{ color: 'var(--primary-900)' }}>#{order.orderCode}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping To:</span>
                <span style={{ color: 'var(--text-main)', textAlign: 'right' }}>
                  {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <span style={{ color: 'var(--text-main)' }}>{order.paymentMethod}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-main)', paddingTop: '0.75rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Total Amount:</span>
                <strong style={{ color: 'var(--primary-900)', fontSize: '1rem' }}>
                  {formatCurrency(order.totalPrice)}
                </strong>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/my-orders/${id}`} className="btn btn-primary btn-md">
              <Package size={18} /> Track My Order
            </Link>
            <Link to="/shop" className="btn btn-outline btn-md">
              <Home size={18} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
