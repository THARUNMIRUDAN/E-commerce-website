import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#090d16',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginTop: '1.5rem',
        border: '1px solid #1e293b',
      }}
    >
      <div
        className="container"
        style={{
          padding: '4.5rem 2rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Text Content */}
          <div style={{ maxWidth: '580px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(225, 29, 72, 0.15)',
                color: '#fb7185',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1.5rem',
                border: '1px solid rgba(225, 29, 72, 0.3)',
              }}
            >
              <Sparkles size={15} />
              NEW SEASON COLLECTION 2026
            </div>

            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
              }}
            >
              Shop Top Brands & <br />
              <span style={{ color: 'var(--accent-600)' }}>Everyday Essentials.</span>
            </h1>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
              }}
            >
              Explore top-rated electronics, fashion, home goods, and more with fast shipping and easy returns.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-accent btn-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/shop?sort=popular" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#334155' }}>
                Popular Items
              </Link>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid #1e293b',
                color: '#cbd5e1',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--emerald-500)" /> Certified Authentic
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--accent-600)', fontWeight: 800 }}>★ 4.9/5</span> Average Customer Rating
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '440px',
                aspectRatio: '1',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                border: '1px solid #334155',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                alt="Sony WH-1000XM5 Studio Edition"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.25rem',
                  right: '1.25rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(10px)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Featured Spotlight
                  </span>
                  <h6 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>
                    Sony WH-1000XM5
                  </h6>
                </div>
                <Link to="/shop?category=electronics" className="btn btn-accent btn-sm">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
