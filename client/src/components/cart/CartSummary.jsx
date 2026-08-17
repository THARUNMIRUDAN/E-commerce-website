import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

const CartSummary = ({ cart, showCheckoutButton = true }) => {
  const { subtotal = 0, discount = 0, deliveryCharge = 0, grandTotal = 0 } = cart;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '1.75rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-main)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <h4 style={{ fontWeight: 800, paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        Order Summary
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Subtotal</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(subtotal + discount)}</span>
        </div>

        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald-500)' }}>
            <span>Discount Savings</span>
            <span style={{ fontWeight: 600 }}>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Delivery Charge</span>
          <span style={{ fontWeight: 600, color: deliveryCharge === 0 ? 'var(--emerald-500)' : 'var(--text-main)' }}>
            {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
          </span>
        </div>

        {subtotal < 1500 && subtotal > 0 && (
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Truck size={14} color="var(--accent-600)" />
            <span>Add {formatCurrency(1500 - subtotal)} more for Free Express Delivery!</span>
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1.5px dashed var(--border-main)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-900)' }}>Total</span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Including all taxes</p>
        </div>
        <span
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-900)',
          }}
        >
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {showCheckoutButton && (
        <Link
          to="/checkout"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Proceed to Checkout <ArrowRight size={18} />
        </Link>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginTop: '0.25rem',
        }}
      >
        <ShieldCheck size={16} color="var(--emerald-500)" />
        <span>Safe & Encrypted 256-bit Checkout</span>
      </div>
    </div>
  );
};

export default CartSummary;
