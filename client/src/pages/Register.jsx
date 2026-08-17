import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, confirmPassword);
      navigate('/', { replace: true });
    } catch (error) {
      // Handled by Toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="section"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <div className="container" style={{ maxWidth: '460px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-main)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-900)',
                color: 'var(--accent-600)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.4rem',
                marginBottom: '1rem',
              }}
            >
              R
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Your Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Join Royal Shopping to track orders and checkout faster
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="register-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="register-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1.75rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--accent-600)' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
