import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BiSun, BiMoon, BiSearch, BiUser, BiBookOpen,
  BiMessageSquareDetail, BiGroup, BiHomeAlt,
  BiBell, BiMenu, BiX, BiLogOut, BiGridAlt,
  BiBarChart
} from 'react-icons/bi';
import api from '../services/api';

export default function Layout({ children, theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);
  const intervalRef = useRef(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, [location]);

  // Poll notifications
  useEffect(() => {
    if (!token) return;
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data.unreadCount || 0);
      } catch {}
    };
    fetchUnread();
    intervalRef.current = setInterval(fetchUnread, 30000);
    return () => clearInterval(intervalRef.current);
  }, [token, location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setMobileOpen(false);
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: <BiHomeAlt size={18} /> },
    { path: '/browse', label: 'Browse', icon: <BiSearch size={18} /> },
    { path: '/matches', label: 'Matches', icon: <BiGroup size={18} /> },
    { path: '/community', label: 'Community', icon: <BiBookOpen size={18} /> },
  ];

  const authLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <BiGridAlt size={18} /> },
    { path: '/bookings', label: 'Requests', icon: <BiBarChart size={18} /> },
    { path: '/messages', label: 'Messages', icon: <BiMessageSquareDetail size={18} /> },
    { path: '/profile', label: 'Profile', icon: <BiUser size={18} /> },
  ];

  return (
    <div className="app-container">
      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '4.5rem',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 50, display: 'flex', alignItems: 'center',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', boxShadow: '0 4px 12px var(--primary-glow)',
            }}>🎓</div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}
              className="text-gradient">CampusSkills</span>
          </Link>

          {/* Desktop nav links */}
          <div className="flex items-center gap-1 hide-mobile">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem', fontWeight: 600,
                color: isActive(link.path) ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: isActive(link.path) ? 'var(--primary-light)' : 'transparent',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { if (!isActive(link.path)) { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; }}}
                onMouseLeave={e => { if (!isActive(link.path)) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              {theme === 'light' ? <BiMoon size={20} /> : <BiSun size={20} />}
            </button>

            {token ? (
              <>
                {/* Notification Bell */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="btn btn-ghost"
                  style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', position: 'relative' }}
                >
                  <BiBell size={22} />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </button>

                {/* User Avatar (desktop) */}
                <div className="hide-mobile flex items-center gap-2">
                  <button
                    onClick={() => navigate('/profile')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.35rem 0.75rem 0.35rem 0.35rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1.5px solid var(--border)',
                      background: 'var(--bg-surface)',
                      cursor: 'pointer', transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="avatar avatar-sm" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                      {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name?.split(' ')[0] || 'Me'}</span>
                  </button>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ gap: '0.375rem' }}>
                    <BiLogOut size={15} /> Logout
                  </button>
                </div>

                {/* Mobile hamburger */}
                <button
                  className="show-mobile-only btn btn-ghost"
                  style={{ padding: '0.5rem' }}
                  onClick={() => setMobileOpen(true)}
                >
                  <BiMenu size={24} />
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn btn-outline btn-sm hide-mobile">Sign In</Link>
                <Link to="/auth" className="btn btn-primary btn-sm">Join Free</Link>
                <button
                  className="show-mobile-only btn btn-ghost"
                  style={{ padding: '0.5rem' }}
                  onClick={() => setMobileOpen(true)}
                >
                  <BiMenu size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Overlay ── */}
      <div className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* ── Mobile Drawer ── */}
      <div className={`mobile-menu-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <span className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Menu</span>
          <button onClick={() => setMobileOpen(false)} className="btn btn-ghost" style={{ padding: '0.4rem' }}>
            <BiX size={24} />
          </button>
        </div>

        {/* User info */}
        {token && user && (
          <div className="flex items-center gap-3" style={{
            padding: '0.875rem 1rem', marginBottom: '1rem',
            background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)',
          }}>
            <div className="avatar avatar-md">{user.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        {navLinks.map(link => (
          <button key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false); }}
            className={`mobile-nav-link w-full ${isActive(link.path) ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', justifyContent: 'flex-start' }}>
            {link.icon} {link.label}
          </button>
        ))}

        {token && (
          <>
            <div className="divider" />
            {authLinks.map(link => (
              <button key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className={`mobile-nav-link w-full ${isActive(link.path) ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', justifyContent: 'flex-start' }}>
                {link.icon} {link.label}
              </button>
            ))}
            <button onClick={() => { navigate('/notifications'); setMobileOpen(false); }}
              className="mobile-nav-link w-full"
              style={{ background: 'none', border: 'none', justifyContent: 'flex-start' }}>
              <BiBell size={18} /> Notifications
              {unreadCount > 0 && <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>{unreadCount}</span>}
            </button>
            <div className="divider" style={{ marginTop: 'auto' }} />
            <button onClick={handleLogout} className="mobile-nav-link w-full"
              style={{ color: 'var(--accent)', background: 'none', border: 'none', justifyContent: 'flex-start' }}>
              <BiLogOut size={18} /> Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <div className="divider" />
            <button onClick={() => { navigate('/auth'); setMobileOpen(false); }} className="btn btn-primary w-full">
              Sign In / Join Free
            </button>
          </>
        )}
      </div>

      {/* ── Main Content ── */}
      <main className="main-content">{children}</main>

      {/* ── Footer ── */}
      <footer style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '2rem 0',
        marginTop: 'auto',
      }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1.2rem' }}>🎓</span>
            <span style={{ fontWeight: 700 }} className="text-gradient">CampusSkills</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>© 2026</span>
          </div>
          <div className="flex gap-4">
            <Link to="/admin" className="text-muted" style={{ fontSize: '0.85rem' }}>Admin</Link>
            <Link to="/browse" className="text-muted" style={{ fontSize: '0.85rem' }}>Browse</Link>
            <Link to="/community" className="text-muted" style={{ fontSize: '0.85rem' }}>Community</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
