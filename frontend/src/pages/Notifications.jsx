import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch notifications.');
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markAsRead(n.id);
    }
    
    // Attempt to parse metadata for navigation
    let meta = {};
    if (n.data) {
      try {
        meta = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
      } catch (err) {
        console.error('Error parsing notification data', err);
      }
    }

    if (meta.sessionId) {
      navigate('/dashboard');
    } else if (n.type?.startsWith('MESSAGE')) {
      navigate('/messages');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
        <p className="text-muted">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>⚠️ {error}</div>
        <button onClick={fetchNotifications} className="btn btn-outline">Retry</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Notifications</h1>
          <p className="text-muted">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-outline btn-sm">
            ✓ Mark all as read
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔔</div>
            <h3>No notifications yet</h3>
            <p style={{ marginTop: '0.5rem' }}>We will notify you here when you get requests or comments.</p>
          </div>
        ) : (
          <div>
            {notifications.map((n, i) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: '1.5rem',
                  borderBottom: i !== notifications.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  backgroundColor: n.isRead ? 'transparent' : 'var(--primary-light)',
                  transition: 'background-color var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
                className="notification-item"
              >
                {/* Visual Unread Dot */}
                {!n.isRead && (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    marginTop: '8px',
                    flexShrink: 0
                  }} />
                )}
                
                <div style={{ flex: 1 }}>
                  <div className="flex justify-between items-baseline" style={{ gap: '1rem', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.975rem', fontWeight: n.isRead ? 600 : 700 }}>{n.title}</h4>
                    <span className="text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: 1.5, color: n.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
