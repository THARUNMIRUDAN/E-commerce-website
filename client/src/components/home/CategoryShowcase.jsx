import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryShowcase = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Browse products by category</p>
          </div>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              color: 'var(--accent-600)',
              fontSize: '0.95rem',
            }}
          >
            All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="card card-hover"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                paddingTop: '110%',
                backgroundColor: 'var(--bg-subtle)',
                display: 'block',
              }}
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                alt={cat.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.85)',
                  transition: 'transform 0.4s ease',
                }}
                className="category-card-img"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  color: '#ffffff',
                }}
              >
                <h5 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>
                  {cat.name}
                </h5>
                {cat.productCount !== undefined && (
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                    {cat.productCount} Products
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .category-card-img:hover {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
};

export default CategoryShowcase;
