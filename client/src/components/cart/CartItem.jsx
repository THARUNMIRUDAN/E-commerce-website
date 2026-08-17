import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item || !item.product) return null;

  const { product, quantity, price } = item;
  const lineTotal = price * quantity;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--border-main)',
      }}
    >
      {/* Product Image */}
      <Link
        to={`/products/${product._id}`}
        style={{
          width: '90px',
          height: '90px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9',
          flexShrink: 0,
        }}
      >
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Link>

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {product.brand}
        </span>
        <Link
          to={`/products/${product._id}`}
          style={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </Link>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {formatCurrency(price)}
        </span>
      </div>

      {/* Quantity Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid var(--border-main)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <button
          onClick={() => onUpdateQuantity(product._id, quantity - 1)}
          disabled={quantity <= 1}
          style={{
            padding: '0.4rem 0.6rem',
            background: 'none',
            border: 'none',
            cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
            opacity: quantity <= 1 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.9rem', minWidth: '24px', textAlign: 'center' }}>
          {quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(product._id, quantity + 1)}
          disabled={quantity >= product.stock}
          style={{
            padding: '0.4rem 0.6rem',
            background: 'none',
            border: 'none',
            cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
            opacity: quantity >= product.stock ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Line Total */}
      <div style={{ minWidth: '90px', textAlign: 'right' }}>
        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-900)' }}>
          {formatCurrency(lineTotal)}
        </span>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product._id)}
        className="btn-icon btn-ghost"
        style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
        title="Remove item"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
