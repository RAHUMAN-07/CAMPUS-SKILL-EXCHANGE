import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RequestModal({ teacher, onClose, onSubmit }) {
  const [form, setForm] = useState({
    skillId: teacher?.teachSkills?.[0]?.skillId || '',
    scheduledAt: '',
    durationMinutes: 60,
    message: '',
    topic: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.scheduledAt) { setError('Please pick a date & time'); return; }
    setLoading(true);
    try {
      await onSubmit({
        teacherId: teacher.id,
        skillId: parseInt(form.skillId, 10),
        scheduledAt: form.scheduledAt,
        durationMinutes: parseInt(form.durationMinutes, 10),
        message: form.message,
        topic: form.topic,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());
  const minStr = minDate.toISOString().slice(0, 16);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale-in">
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>📬 Request Swap</h3>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem', fontSize: '1.2rem' }}>✕</button>
        </div>

        <div className="flex items-center gap-3" style={{ padding: '1rem', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
          <div className="avatar avatar-md">{teacher.name?.charAt(0)?.toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 700 }}>{teacher.name}</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{teacher.university}</div>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Skill to Learn *</label>
            <select className="input" value={form.skillId} onChange={e => setForm(p => ({ ...p, skillId: e.target.value }))} required>
              {teacher.teachSkills?.map(ts => (
                <option key={ts.skillId} value={ts.skillId}>{ts.skill?.name || 'Unknown'}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>When? *</label>
            <input type="datetime-local" className="input" min={minStr}
              value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Duration</label>
            <select className="input" value={form.durationMinutes} onChange={e => setForm(p => ({ ...p, durationMinutes: e.target.value }))}>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Topic / What to cover</label>
            <input type="text" className="input" placeholder="e.g. React hooks, async/await..." value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Message</label>
            <textarea className="input" rows={3} placeholder="Hi! I'd love to learn..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Sending...' : '🚀 Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [userRes, sessionsRes, recRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/sessions'),
        api.get('/match/recommendations')
      ]);
      setUser(userRes.data);
      setSessions(sessionsRes.data.sessions || []);
      setRecommendations(recRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Please try again.');
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSessionAction = async (id, action) => {
    try {
      await api.put(`/sessions/${id}/${action}`);
      showToast(`Session ${action}ed successfully!`);
      fetchDashboardData();
    } catch (err) {
      showToast(`Failed to ${action} session: ` + (err.response?.data?.error || 'error'));
    }
  };

  const handleRequestSwap = async (payload) => {
    try {
      await api.post('/sessions', payload);
      showToast('✅ Session request sent!');
    } catch (err) {
      showToast('⚠️ ' + (err.response?.data?.error || 'Failed to send request'));
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
        <p className="text-muted">Loading your personal dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>⚠️ {error}</div>
        <button onClick={fetchDashboardData} className="btn btn-outline">Retry</button>
      </div>
    );
  }

  const upcoming = sessions.filter(s => ['ACCEPTED', 'IN_PROGRESS'].includes(s.status));
  const pending = sessions.filter(s => s.status === 'PENDING');

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Welcome back, <span className="text-gradient">{user?.name}</span> 👋
        </h1>
        <p className="text-muted">Manage your skill swaps, check upcoming sessions, and review recommendations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card text-center" style={{ padding: '1.75rem' }}>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Tokens</p>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            {user?.totalPoints}
          </h2>
        </div>
        <div className="card text-center" style={{ padding: '1.75rem' }}>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trust Score</p>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--secondary)', fontWeight: 800 }}>
            {Math.round(user?.trustScore)}%
          </h2>
        </div>
        <div className="card text-center" style={{ padding: '1.75rem' }}>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sessions</p>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--text-main)', fontWeight: 800 }}>
            {sessions.filter(s => s.status === 'COMPLETED').length}
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Column */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Upcoming Sessions */}
          <div>
            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.4rem' }}>📅 Upcoming Swap Sessions</h2>
            {upcoming.length === 0 ? (
              <div className="card text-center" style={{ padding: '2.5rem', color: 'var(--text-muted)' }}>
                <p>No upcoming sessions scheduled.</p>
                <button onClick={() => navigate('/browse')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Browse Skills</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcoming.map(s => {
                  const isTeacher = s.teacherId === user?.id;
                  const partner = isTeacher ? s.student : s.teacher;
                  return (
                    <div key={s.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                      <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>{s.skill?.name}</h3>
                          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                            {isTeacher ? 'Teaching' : 'Learning'} with <strong>{partner?.name}</strong>
                          </p>
                        </div>
                        <span className="badge badge-primary">Confirmed</span>
                      </div>
                      
                      <div style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        <p style={{ margin: '0.25rem 0' }}>📅 {new Date(s.scheduledAt).toLocaleString()}</p>
                        <p style={{ margin: '0.25rem 0' }}>⏱️ Duration: {s.durationMinutes} minutes</p>
                        {s.topic && <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>📌 Topic: {s.topic}</p>}
                      </div>

                      <div className="flex gap-3">
                        {s.meetingLink && (
                          <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                            Join Call 📞
                          </a>
                        )}
                        <button onClick={() => handleSessionAction(s.id, 'confirm')} className="btn btn-secondary btn-sm">
                          Mark Complete Checkmark
                        </button>
                        <button onClick={() => handleSessionAction(s.id, 'cancel')} className="btn btn-outline btn-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Swaps */}
          <div>
            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.4rem' }}>📬 Pending Swap Requests</h2>
            {pending.length === 0 ? (
              <div className="card text-center" style={{ padding: '2.5rem', color: 'var(--text-muted)' }}>
                <p>No pending swap requests.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pending.map(s => {
                  const isTeacher = s.teacherId === user?.id;
                  const partner = isTeacher ? s.student : s.teacher;
                  return (
                    <div key={s.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                      <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>{s.skill?.name}</h3>
                          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                            {isTeacher ? `Request from ${partner?.name}` : `Sent to ${partner?.name}`}
                          </p>
                        </div>
                        <span className="badge badge-warning" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>Awaiting Approval</span>
                      </div>

                      <div style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        <p style={{ margin: '0.25rem 0' }}>📅 {new Date(s.scheduledAt).toLocaleString()}</p>
                        <p style={{ margin: '0.25rem 0' }}>⏱️ Duration: {s.durationMinutes} mins</p>
                        {s.message && <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)' }}>💬 "{s.message}"</p>}
                      </div>

                      <div className="flex gap-3">
                        {isTeacher ? (
                          <>
                            <button onClick={() => handleSessionAction(s.id, 'accept')} className="btn btn-primary btn-sm">Accept</button>
                            <button onClick={() => handleSessionAction(s.id, 'decline')} className="btn btn-outline btn-sm">Decline</button>
                          </>
                        ) : (
                          <button onClick={() => handleSessionAction(s.id, 'cancel')} className="btn btn-outline btn-sm">Cancel Request</button>
                        )}
                        <button onClick={() => navigate('/messages')} className="btn btn-ghost btn-sm">Chat 💬</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Column */}
        <div>
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.4rem' }}>🌟 Smart Matches</h2>
          {recommendations.length === 0 ? (
            <div className="card text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Add skills you want to learn in your profile to find peer matches!</p>
              <button onClick={() => navigate('/profile')} className="btn btn-outline btn-sm">Edit Profile</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recommendations.slice(0, 5).map(rec => (
                <div key={rec.id} className="card" style={{ padding: '1.25rem' }}>
                  <div className="flex items-center gap-3" style={{ marginBottom: '0.75rem' }}>
                    <div className="avatar avatar-sm">{initials(rec.user?.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.user?.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>🏫 {rec.user?.university}</div>
                    </div>
                    <div className="badge badge-secondary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                      {rec.matchScore}% Match
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }} className="text-muted">
                    Can teach you: <strong>{rec.skill?.name}</strong>
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTeacher({
                        id: rec.userId,
                        name: rec.user?.name,
                        university: rec.user?.university,
                        teachSkills: [{ skillId: rec.skillId, skill: rec.skill }]
                      })}
                      className="btn btn-primary btn-sm flex-1"
                      style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => navigate('/browse')}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    >
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {selectedTeacher && (
        <RequestModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onSubmit={handleRequestSwap}
        />
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
