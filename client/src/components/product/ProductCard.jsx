import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import RatingStars from '../common/RatingStars.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock < 1) return;

    setIsAdding(true);
    await addToCart(product._id, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-main)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Product Image Box */}
      <Link
        to={`/products/${product._id}`}
        style={{
          position: 'relative',
          paddingTop: '85%',
          backgroundColor: '#f1f5f9',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="product-card-img"
        />

        {/* Badges: Discount & Stock */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            zIndex: 2,
          }}
        >
          {hasDiscount && (
            <span className="badge badge-accent">-{discountPercent}%</span>
          )}
          {product.stock === 0 ? (
            <span className="badge badge-warning">Out of Stock</span>
          ) : product.featured ? (
            <span className="badge badge-primary">Featured</span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
          }}
        >
          <Heart
            size={18}
            color={inWishlist ? 'var(--accent-600)' : 'var(--text-secondary)'}
            fill={inWishlist ? 'var(--accent-600)' : 'transparent'}
          />
        </button>
      </Link>

      {/* Product Content Details */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Brand & Category */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            {product.brand}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            {product.category?.name || ''}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product._id}`}
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-main)',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.7rem',
          }}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div style={{ marginBottom: '0.75rem' }}>
          <RatingStars rating={product.rating} numReviews={product.numReviews} size={14} />
        </div>

        {/* Price & Action */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--primary-900)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {formatCurrency(activePrice)}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-light)',
                  textDecoration: 'line-through',
                }}
              >
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`btn ${isAdding ? 'btn-primary' : 'btn-outline'} btn-sm`}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
            }}
            aria-label="Add to cart"
          >
            {isAdding ? (
              <>
                <Check size={15} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={15} /> Add
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .product-card-img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
