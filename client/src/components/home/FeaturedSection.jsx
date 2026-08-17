import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard.jsx';

const FeaturedSection = ({ products = [], title = 'Featured Products', subtitle = 'Handpicked signature essentials' }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
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
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
