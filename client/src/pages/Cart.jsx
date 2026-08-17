import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import Loader from '../components/common/Loader.jsx';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  if (loading) {
    return <Loader fullScreen message="Updating your bag..." />;
  }

  const items = cart.items || [];

  return (
    <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Shopping Bag</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {cart.totalItems || 0} item{cart.totalItems === 1 ? '' : 's'} in your bag
          </p>
        </div>

        {items.length === 0 ? (
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
            <h3 style={{ fontWeight: 700 }}>Your Bag is Currently Empty</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px' }}>
              Looks like you haven't added anything to your cart yet. Explore our curated collections to find essentials you'll love.
            </p>
            <Link to="/shop" className="btn btn-primary btn-md">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '3rem',
              alignItems: 'flex-start',
            }}
            className="cart-grid"
          >
            {/* Cart Items List */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '1.75rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-main)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Items</span>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--rose-500)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Trash2 size={14} /> Clear All
                </button>
              </div>

              <div>
                {items.map((item) => (
                  <CartItem
                    key={item.product?._id || item._id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            </div>

            {/* Sticky Cart Summary */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <CartSummary cart={cart} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 960px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
