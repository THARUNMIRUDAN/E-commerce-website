import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Package,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll effect for subtle header elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
      setKeyword('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 800,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--bg-surface)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-main)',
        transition: 'all var(--transition-base)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'var(--navbar-height)',
            gap: '1.5rem',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: 'var(--primary-900)',
              letterSpacing: '-0.03em',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--primary-900)',
                color: 'var(--accent-600)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
              }}
            >
              R
            </span>
            <span>
              Royal <span style={{ color: 'var(--accent-600)' }}>Shopping</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
            className="desktop-nav"
          >
            <Link
              to="/"
              style={{
                color: location.pathname === '/' ? 'var(--accent-600)' : 'var(--text-main)',
              }}
            >
              Home
            </Link>
            <Link
              to="/shop"
              style={{
                color: location.pathname === '/shop' ? 'var(--accent-600)' : 'var(--text-main)',
              }}
            >
              Shop All
            </Link>
            <Link
              to="/shop?category=electronics"
              style={{ color: 'var(--text-secondary)' }}
            >
              Electronics
            </Link>
            <Link
              to="/shop?category=fashion"
              style={{ color: 'var(--text-secondary)' }}
            >
              Fashion
            </Link>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{
              flex: 1,
              maxWidth: '380px',
              position: 'relative',
              display: 'none',
            }}
            className="desktop-search"
          >
            <input
              type="text"
              placeholder="Search audio, watches, apparel..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.6rem',
                paddingBottom: '0.6rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'transparent',
              }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </form>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="btn-icon btn-ghost"
              style={{ position: 'relative' }}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={22} color="var(--text-main)" />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--accent-600)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="btn-icon btn-ghost"
              style={{ position: 'relative' }}
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag size={22} color="var(--text-main)" />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--primary-900)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.8rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-main)',
                    background: 'var(--bg-subtle)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  <UserIcon size={16} />
                  <span
                    style={{
                      maxWidth: '90px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '210px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border-main)',
                      padding: '0.5rem 0',
                      zIndex: 900,
                    }}
                  >
                    <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {user?.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {user?.email}
                      </p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--accent-600)',
                          fontWeight: 600,
                        }}
                      >
                        <Sliders size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      <UserIcon size={16} />
                      My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      <Package size={16} />
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      <Heart size={16} />
                      Wishlist
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--rose-500)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderTop: '1px solid var(--border-subtle)',
                        marginTop: '0.25rem',
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="btn-icon btn-ghost mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{ display: 'none' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 0 1.5rem',
              borderTop: '1px solid var(--border-main)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '2.5rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-subtle)',
                }}
              />
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </form>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: 600 }}>
              <Link to="/" style={{ padding: '0.5rem 0' }}>Home</Link>
              <Link to="/shop" style={{ padding: '0.5rem 0' }}>Shop All Products</Link>
              <Link to="/shop?category=electronics" style={{ padding: '0.5rem 0' }}>Electronics</Link>
              <Link to="/shop?category=fashion" style={{ padding: '0.5rem 0' }}>Fashion</Link>
              <Link to="/shop?category=beauty" style={{ padding: '0.5rem 0' }}>Beauty</Link>
              <Link to="/shop?category=home" style={{ padding: '0.5rem 0' }}>Home & Living</Link>
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-search { display: block !important; }
        }
        @media (max-width: 768px) {
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
