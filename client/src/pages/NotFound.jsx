import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      className="section"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '520px' }}>
        <span
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--accent-600)',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          404
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          The page you are searching for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary btn-md">
            <Home size={18} /> Return Home
          </Link>
          <Link to="/shop" className="btn btn-outline btn-md">
            <Compass size={18} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
