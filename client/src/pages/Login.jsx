import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      // Error toast is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setLoading(true);
      await login(demoEmail, demoPassword);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      // Handled
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
        minHeight: '75vh',
      }}
    >
      <div className="container" style={{ maxWidth: '440px' }}>
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
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Sign in to your Royal Shopping account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.65rem', textAlign: 'center', fontWeight: 600 }}>
              DEMO ACCOUNTS
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@revibe.com', 'adminpassword123')}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                <Shield size={13} color="var(--accent-600)" /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('tharun@revibe.com', 'userpassword123')}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                <LogIn size={13} /> User
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--accent-600)' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
