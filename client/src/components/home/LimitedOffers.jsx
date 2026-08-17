import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const LimitedOffers = () => {
  return (
    <section className="section" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #334155',
          }}
        >
          <div style={{ maxWidth: '540px', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(225, 29, 72, 0.2)',
                color: '#fb7185',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={14} /> LIMITED TIME PROMOTION
            </div>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
              Special Offers & Featured Deals
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Save up to 30% on select electronics, smart devices, and accessories. Free shipping on all orders over ₹1,500.
            </p>
            <Link to="/shop?category=electronics" className="btn btn-accent btn-md">
              View Deals <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              position: 'relative',
              width: '280px',
              height: '220px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid #475569',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80"
              alt="Marshall Speaker Promotion"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedOffers;
