import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, ArrowRight, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      showToast('Thank you for subscribing to Royal Shopping!', 'success');
      setEmail('');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--primary-900)',
        color: '#f8fafc',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      {/* Brand Value Propositions Bar */}
      <div
        style={{
          borderBottom: '1px solid #1e293b',
          padding: '2.5rem 0',
          backgroundColor: '#090d16',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-600)',
                  flexShrink: 0,
                }}
              >
                <Truck size={24} />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '2px' }}>
                  Express Delivery
                </h5>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Free shipping over ₹1,500</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-600)',
                  flexShrink: 0,
                }}
              >
                <RotateCcw size={24} />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '2px' }}>
                  30-Day Easy Returns
                </h5>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Hassle-free money back</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-600)',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '2px' }}>
                  100% Authentic
                </h5>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Directly verified brands</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-600)',
                  flexShrink: 0,
                }}
              >
                <Headphones size={24} />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '2px' }}>
                  Customer Support
                </h5>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Dedicated help desk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                fontSize: '1.6rem',
                color: '#ffffff',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--accent-600)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                R
              </span>
              <span>
                Royal <span style={{ color: 'var(--accent-600)' }}>Shopping</span>
              </span>
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your one-stop destination for quality electronics, apparel, and home essentials.
            </p>
          </div>

          {/* Col 1 */}
          <div>
            <h5 style={{ color: '#ffffff', marginBottom: '1.25rem', fontSize: '1rem' }}>Categories</h5>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><Link to="/shop?category=electronics" style={{ color: '#94a3b8' }}>Electronics</Link></li>
              <li><Link to="/shop?category=fashion" style={{ color: '#94a3b8' }}>Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=beauty" style={{ color: '#94a3b8' }}>Beauty & Wellness</Link></li>
              <li><Link to="/shop?category=home" style={{ color: '#94a3b8' }}>Home & Living</Link></li>
              <li><Link to="/shop?category=accessories" style={{ color: '#94a3b8' }}>Everyday Accessories</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h5 style={{ color: '#ffffff', marginBottom: '1.25rem', fontSize: '1rem' }}>Customer Care</h5>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li><Link to="/my-orders" style={{ color: '#94a3b8' }}>Track My Order</Link></li>
              <li><Link to="/wishlist" style={{ color: '#94a3b8' }}>Wishlist</Link></li>
              <li><Link to="/cart" style={{ color: '#94a3b8' }}>Shopping Cart</Link></li>
              <li><Link to="/profile" style={{ color: '#94a3b8' }}>Account Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div>
            <h5 style={{ color: '#ffffff', marginBottom: '1.25rem', fontSize: '1rem' }}>Royal Shopping Newsletter</h5>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Subscribe for exclusive deals, new arrivals, and special discounts.
            </p>
            {subscribed ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--emerald-500)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <Check size={18} /> Subscribed to updates!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                  }}
                />
                <button type="submit" className="btn btn-accent btn-sm" aria-label="Subscribe">
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <p>© {new Date().getFullYear()} Royal Shopping. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
