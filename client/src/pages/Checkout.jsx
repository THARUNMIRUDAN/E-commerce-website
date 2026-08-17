import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Banknote, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AddressForm from '../components/checkout/AddressForm.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { orderService } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setAddress({
        fullName: user.address?.fullName || user.name || '',
        phone: user.address?.phone || user.phone || '',
        address: user.address?.address || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
      });
    }
  }, [user]);

  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !address.fullName.trim() ||
      !address.phone.trim() ||
      !address.address.trim() ||
      !address.city.trim() ||
      !address.postalCode.trim()
    ) {
      showToast('Please complete all shipping address fields', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        orderItems: items.map((item) => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images[0] || '',
          price: item.price,
          product: item.product._id,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const createdOrder = await orderService.create(orderPayload);
      await refreshCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-success/${createdOrder._id}`, { replace: true });
    } catch (error) {
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/cart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            <ArrowLeft size={16} /> Return to Cart
          </Link>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Checkout</h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete your order with Cash on Delivery</p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 420px',
            gap: '3rem',
            alignItems: 'flex-start',
          }}
          className="checkout-layout"
        >
          {/* Left Column: Address & Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AddressForm address={address} onChange={setAddress} />

            {/* Payment Method */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '1.75rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-main)',
              }}
            >
              <h4 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>2. Payment Method</h4>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--primary-900)',
                  backgroundColor: 'var(--bg-subtle)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ accentColor: 'var(--primary-900)', width: '18px', height: '18px' }}
                />
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--emerald-500)',
                  }}
                >
                  <Banknote size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h6 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</h6>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Pay with cash or UPI upon package delivery at your doorstep.
                  </p>
                </div>
                <CheckCircle2 size={20} color="var(--emerald-500)" />
              </label>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-main)',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <h4 style={{ fontWeight: 800, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              Order Review ({cart.totalItems} Items)
            </h4>

            {/* Items summary */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '220px',
                overflowY: 'auto',
                paddingRight: '0.25rem',
                marginBottom: '1.25rem',
              }}
            >
              {items.map((item) => (
                <div
                  key={item.product?._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--text-main)',
                      }}
                    >
                      {item.product.name}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary-900)' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1rem',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Items Subtotal</span>
                <span>{formatCurrency(cart.subtotal + cart.discount)}</span>
              </div>

              {cart.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald-500)' }}>
                  <span>Promotional Discount</span>
                  <span>-{formatCurrency(cart.discount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Charge</span>
                <span style={{ color: cart.deliveryPrice === 0 ? 'var(--emerald-500)' : 'var(--text-main)', fontWeight: 600 }}>
                  {cart.deliveryPrice === 0 ? 'FREE' : formatCurrency(cart.deliveryPrice)}
                </span>
              </div>

              <div
                style={{
                  borderTop: '1.5px dashed var(--border-main)',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-900)' }}>Total Due</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-900)' }}>
                  {formatCurrency(cart.grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {submitting ? 'Placing Order...' : `Place Order • ${formatCurrency(cart.grandTotal)}`}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '1rem',
              }}
            >
              <Truck size={14} color="var(--emerald-500)" />
              <span>Standard delivery in 2-4 business days</span>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
