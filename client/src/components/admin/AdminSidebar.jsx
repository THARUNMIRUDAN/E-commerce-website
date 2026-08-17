import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  ArrowLeft,
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Products', to: '/admin/products', icon: Package },
    { label: 'Categories', to: '/admin/categories', icon: Layers },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', to: '/admin/users', icon: Users },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        borderRight: '1px solid #1e293b',
        padding: '1.5rem',
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '1.3rem',
            color: '#ffffff',
          }}
        >
          <span
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--accent-600)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
            }}
          >
            R
          </span>
          <span>Royal Shopping Admin</span>
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.2rem' }}>
          Admin Dashboard
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#1e293b' : 'transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Return to store */}
      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#94a3b8',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Return to Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
