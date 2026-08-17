import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, AlertTriangle, X } from 'lucide-react';
import OrderTracker from '../components/order/OrderTracker.jsx';
import Loader from '../components/common/Loader.jsx';
import { orderService } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';
import { useToast } from '../context/ToastContext.jsx';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { showToast } = useToast();

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getById(id);
      setOrder(data);
    } catch (error) {
      console.error('[OrderDetail] Error fetching order:', error.message);
      showToast('Could not load order details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await orderService.cancel(id, cancelReason || 'Cancelled by user');
      showToast('Order has been cancelled successfully', 'info');
      setShowCancelModal(false);
      fetchOrder();
    } catch (error) {
      showToast(error.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading order tracking..." />;
  }

  if (!order) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          The requested order could not be located in your account.
        </p>
        <Link to="/my-orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <div className="section" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/my-orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> All Orders
          </Link>
        </div>

        {/* Order Title Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order #{order.orderCode}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn btn-danger btn-sm"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Tracker Progress Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-main)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2.5rem',
          }}
        >
          <h4 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Order Timeline</h4>
          <OrderTracker currentStatus={order.orderStatus} statusHistory={order.statusHistory} />
        </div>

        {/* Details Grid: Left: Items, Right: Address & Payment */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '2rem',
            alignItems: 'flex-start',
          }}
          className="order-detail-grid"
        >
          {/* Items List */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-main)',
            }}
          >
            <h4 style={{ fontWeight: 800, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              Itemized Invoice ({order.orderItems.length} Products)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: idx < order.orderItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/products/${item.product?._id || item.product}`}
                      style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}
                    >
                      {item.name}
                    </Link>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Quantity: {item.qty} × {formatCurrency(item.price)}
                    </span>
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-900)' }}>
                    {formatCurrency(item.price * item.qty)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div
              style={{
                marginTop: '1.5rem',
                borderTop: '1.5px solid var(--border-main)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(order.itemsPrice + (order.discountAmount || 0))}</span>
              </div>

              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald-500)' }}>
                  <span>Discount Applied</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Charges</span>
                <span style={{ color: order.deliveryPrice === 0 ? 'var(--emerald-500)' : 'var(--text-main)' }}>
                  {order.deliveryPrice === 0 ? 'FREE' : formatCurrency(order.deliveryPrice)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1.5px dashed var(--border-main)',
                  paddingTop: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>Total Paid</strong>
                <strong style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-900)' }}>
                  {formatCurrency(order.totalPrice)}
                </strong>
              </div>
            </div>
          </div>

          {/* Shipping Address & Mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-main)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MapPin size={18} color="var(--primary-900)" />
                <h5 style={{ fontWeight: 700 }}>Delivery Destination</h5>
              </div>

              <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {order.shippingAddress.fullName}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-main)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CreditCard size={18} color="var(--primary-900)" />
                <h5 style={{ fontWeight: 700 }}>Payment Info</h5>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {order.paymentMethod}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Status: {order.orderStatus === 'Delivered' ? 'Collected & Verified' : 'Pay upon Delivery'}
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose-500)' }}>
                  <AlertTriangle size={22} />
                  <h4 style={{ fontWeight: 700 }}>Cancel Order #{order.orderCode}</h4>
                </div>
                <button
                  onClick={() => setShowCancelModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Are you sure you want to cancel this order? Stock will be immediately restored and any processing will stop.
              </p>

              <div className="form-group">
                <label className="form-label">Reason for Cancellation (Optional)</label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Changed my mind, found another product..."
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-outline btn-sm"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="btn btn-danger btn-sm"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .order-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;
