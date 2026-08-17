import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  MapPin,
  Lock,
  Package,
  Heart,
  ShoppingBag,
  Clock,
  LogOut,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { authService } from '../services/authService.js';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Address Form state
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Password Form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress({
        fullName: user.address?.fullName || user.name || '',
        phone: user.address?.phone || user.phone || '',
        address: user.address?.address || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await authService.updateProfile({
        name,
        email,
        phone,
      });
      updateUser(updated);
      showToast('Profile information updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await authService.updateProfile({ address });
      updateUser(updated);
      showToast('Shipping address saved!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to save address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setSaving(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--accent-600)',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '0.25rem',
            }}
          >
            My Account
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Account Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage personal credentials, default shipping addresses, and security settings.
          </p>
        </div>

        {/* Shortcut Stats Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          <Link
            to="/my-orders"
            className="card card-hover"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-900)',
              }}
            >
              <Package size={22} />
            </div>
            <div>
              <h6 style={{ fontWeight: 700, fontSize: '0.95rem' }}>My Orders</h6>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View deliveries</span>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="card card-hover"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-600)',
              }}
            >
              <Heart size={22} />
            </div>
            <div>
              <h6 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Wishlist</h6>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saved favorites</span>
            </div>
          </Link>

          <Link
            to="/cart"
            className="card card-hover"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--emerald-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#047857',
              }}
            >
              <ShoppingBag size={22} />
            </div>
            <div>
              <h6 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cart</h6>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Review bag</span>
            </div>
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
          className="profile-layout"
        >
          {/* Side Tabs Navigation */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-main)',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: activeTab === 'profile' ? 'var(--primary-900)' : 'transparent',
                color: activeTab === 'profile' ? '#ffffff' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <UserIcon size={18} />
              <span>Personal Info</span>
            </button>

            <button
              onClick={() => setActiveTab('address')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: activeTab === 'address' ? 'var(--primary-900)' : 'transparent',
                color: activeTab === 'address' ? '#ffffff' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <MapPin size={18} />
              <span>Default Address</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: activeTab === 'password' ? 'var(--primary-900)' : 'transparent',
                color: activeTab === 'password' ? '#ffffff' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Lock size={18} />
              <span>Change Password</span>
            </button>

            <button
              onClick={() => logout()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--rose-500)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '0.5rem',
              }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-main)',
              padding: '2.25rem',
            }}
          >
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Personal Profile</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Update your contact details and registered identity.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-name">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-email">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-phone">Contact Phone Number</label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="form-input"
                  />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary btn-md" style={{ marginTop: '0.5rem' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            )}

            {activeTab === 'address' && (
              <form onSubmit={handleUpdateAddress}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Shipping Address</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  This address will be automatically populated during faster one-click checkout.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Recipient Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Recipient Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address & Landmark</label>
                  <input
                    type="text"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary btn-md" style={{ marginTop: '0.5rem' }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Default Address'}
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Security & Password</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Ensure your account is using a long, random password to stay secure.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="current-pw">Current Password</label>
                  <input
                    id="current-pw"
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="new-pw">New Password (min 6 characters)</label>
                  <input
                    id="new-pw"
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-pw">Confirm New Password</label>
                  <input
                    id="confirm-pw"
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="form-input"
                  />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary btn-md" style={{ marginTop: '0.5rem' }}>
                  <Save size={16} /> {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
