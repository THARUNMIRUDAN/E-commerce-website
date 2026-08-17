import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import RatingStars from '../components/common/RatingStars.jsx';
import Loader from '../components/common/Loader.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return <Loader fullScreen message="Loading your saved items..." />;
  }

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-600)', marginBottom: '0.25rem' }}>
            <Heart size={20} fill="var(--accent-600)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Saved Items
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>My Wishlist</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved to your personal collection
          </p>
        </div>

        {wishlist.length === 0 ? (
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
                backgroundColor: 'var(--accent-50)',
                color: 'var(--accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={32} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Your Wishlist is Empty</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px' }}>
              Explore our handpicked catalog of audio, fashion, and lifestyle essentials to save your favorite items.
            </p>
            <Link to="/shop" className="btn btn-primary btn-md">
              Start Exploring <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {wishlist.map((product) => {
              const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

              return (
                <div
                  key={product._id}
                  className="card card-hover"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-main)',
                  }}
                >
                  <Link
                    to={`/products/${product._id}`}
                    style={{ position: 'relative', paddingTop: '80%', backgroundColor: '#f1f5f9', display: 'block' }}
                  >
                    <img
                      src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                      alt={product.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {product.brand}
                    </span>
                    <Link
                      to={`/products/${product._id}`}
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--text-main)',
                        margin: '0.25rem 0 0.5rem',
                        height: '2.6rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.name}
                    </Link>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <RatingStars rating={product.rating} size={13} showCount={false} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                        {formatCurrency(activePrice)}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: product.stock > 0 ? '#047857' : '#be123c',
                        }}
                      >
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button
                        onClick={() => addToCart(product._id, 1)}
                        disabled={product.stock === 0}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        <ShoppingBag size={14} /> Move to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="btn btn-outline btn-sm btn-icon"
                        title="Remove from wishlist"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
