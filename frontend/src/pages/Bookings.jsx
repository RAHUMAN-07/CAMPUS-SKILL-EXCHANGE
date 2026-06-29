import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Bookings() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'pending', 'past'
  const [toast, setToast] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/sessions');
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch session bookings.');
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/sessions/${id}/${action}`);
      showToast(`Session ${action}ed successfully!`);
      fetchSessions();
    } catch (err) {
      showToast(`Action failed: ` + (err.response?.data?.error || 'error'));
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const initials = (name) => name?.charAt(0)?.toUpperCase() || '?';

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
        <p className="text-muted">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>⚠️ {error}</div>
        <button onClick={fetchSessions} className="btn btn-outline">Retry</button>
      </div>
    );
  }

  // Group sessions
  const upcoming = sessions.filter(s => ['ACCEPTED', 'IN_PROGRESS'].includes(s.status));
  const pending = sessions.filter(s => s.status === 'PENDING');
  const past = sessions.filter(s => ['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(s.status));

  const getActiveList = () => {
    if (activeTab === 'upcoming') return upcoming;
    if (activeTab === 'pending') return pending;
    return past;
  };

  const currentList = getActiveList();

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>My Swaps & Bookings</h1>
          <p className="text-muted">Schedule learning sessions, review incoming requests, and check past swaps.</p>
        </div>
        <button onClick={() => navigate('/browse')} className="btn btn-primary">
          🔍 Find Teachers
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4" style={{ borderBottom: '1px solid var(--border)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { id: 'pending', label: 'Pending Requests', count: pending.length },
          { id: 'past', label: 'Past & Completed', count: past.length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.95rem',
              fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === t.id ? '2px solid var(--primary)' : 'none',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
          >
            {t.label} {t.count > 0 && <span style={{ marginLeft: '0.35rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 'bold' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {currentList.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📅</div>
          <h3>No bookings found</h3>
          <p style={{ marginTop: '0.5rem' }}>
            {activeTab === 'upcoming' && 'No swap sessions are currently confirmed.'}
            {activeTab === 'pending' && 'No swap requests are pending your review.'}
            {activeTab === 'past' && 'No past or completed swap records exist.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {currentList.map(s => {
            const isTeacher = s.teacherId === user?.id;
            const partner = isTeacher ? s.student : s.teacher;
            return (
              <div
                key={s.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderLeft: `4px solid ${
                    s.status === 'PENDING' ? 'var(--warning)' :
                    s.status === 'COMPLETED' ? 'var(--secondary)' :
                    s.status === 'CANCELLED' ? 'var(--text-muted)' : 'var(--primary)'
                  }`
                }}
              >
                <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{s.skill?.name}</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
                      {isTeacher ? 'Teaching' : 'Learning'} with <strong>{partner?.name || 'Peer'}</strong>
                    </p>
                  </div>
                  <span className={`badge ${
                    s.status === 'PENDING' ? 'badge-warning' :
                    s.status === 'COMPLETED' ? 'badge-secondary' :
                    s.status === 'CANCELLED' ? 'badge-danger' : 'badge-primary'
                  }`} style={s.status === 'PENDING' ? { backgroundColor: 'var(--warning-light)', color: 'var(--warning)' } : {}}>
                    {s.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }} className="text-muted">
                  <p>📅 Time: {new Date(s.scheduledAt).toLocaleString()}</p>
                  <p>⏱️ Duration: {s.durationMinutes} minutes</p>
                  {s.topic && <p>📌 Topic: "{s.topic}"</p>}
                  {s.message && <p>💬 Message: "{s.message}"</p>}
                  {s.meetingLink && s.status === 'ACCEPTED' && (
                    <p>🔗 Call Link: <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Join Room</a></p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {s.status === 'PENDING' && (
                    isTeacher ? (
                      <>
                        <button onClick={() => handleAction(s.id, 'accept')} className="btn btn-primary btn-sm">Accept Swap</button>
                        <button onClick={() => handleAction(s.id, 'decline')} className="btn btn-outline btn-sm">Decline</button>
                      </>
                    ) : (
                      <button onClick={() => handleAction(s.id, 'cancel')} className="btn btn-outline btn-sm">Cancel Request</button>
                    )
                  )}

                  {s.status === 'ACCEPTED' && (
                    <>
                      {s.meetingLink && (
                        <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                          Join Call
                        </a>
                      )}
                      <button onClick={() => handleAction(s.id, 'confirm')} className="btn btn-secondary btn-sm">
                        Mark Complete
                      </button>
                      <button onClick={() => handleAction(s.id, 'cancel')} className="btn btn-outline btn-sm">
                        Cancel
                      </button>
                    </>
                  )}

                  <button onClick={() => navigate('/messages')} className="btn btn-ghost btn-sm">
                    Chat Partner
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000,
          background: 'var(--text-main)', color: 'var(--bg-main)', padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          fontWeight: 600, animation: 'slideUp 0.3s ease',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
