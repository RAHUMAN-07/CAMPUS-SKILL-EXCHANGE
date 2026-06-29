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

export default function Matches() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/match/recommendations');
      setRecommendations(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch match recommendations.');
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (payload) => {
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
        <p className="text-muted">Analyzing compatibility and fetching recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>⚠️ {error}</div>
        <button onClick={fetchRecommendations} className="btn btn-outline">Retry</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Smart Match Suggestions</h1>
      <p className="text-muted" style={{ marginBottom: '2.5rem' }}>
        We match your "Skills I Want to Learn" against peers who want to teach them, scoring them based on rating, trust score, and availability.
      </p>
      
      {recommendations.length === 0 ? (
        <div className="card text-center empty-state" style={{ padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
          <h3 style={{ marginBottom: '0.75rem' }}>No match suggestions found</h3>
          <p className="text-muted" style={{ marginBottom: '2.5rem', maxWidth: '400px', margin: '0.5rem auto 2.5rem auto' }}>
            To see suggestions, edit your profile and specify what skills you teach (TEACH) and what skills you want to learn (LEARN)!
          </p>
          <button onClick={() => navigate('/profile')} className="btn btn-primary">
            ✏️ Set My Skills
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {recommendations.map(rec => (
            <div key={rec.id} className="card flex items-start gap-6" style={{ padding: '2rem' }}>
              <div className="avatar avatar-lg hide-mobile" style={{ width: '80px', height: '80px', fontSize: '2rem', flexShrink: 0 }}>
                {initials(rec.user?.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem', gap: '1rem' }}>
                  <h3 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.user?.name}</h3>
                  <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 }}>
                    {rec.matchScore}% Match
                  </span>
                </div>
                
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  🏫 {rec.user?.university}
                </p>

                <p style={{ marginBottom: '1.25rem', fontSize: '0.925rem', lineHeight: 1.5 }}>
                  They can teach you <strong>{rec.skill?.name}</strong> and are rated <strong>{rec.avgRating > 0 ? rec.avgRating.toFixed(1) + ' ⭐' : 'New'}</strong> as a peer expert.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedTeacher({
                      id: rec.userId,
                      name: rec.user?.name,
                      university: rec.user?.university,
                      teachSkills: [{ skillId: rec.skillId, skill: rec.skill }]
                    })}
                    className="btn btn-primary flex-1"
                  >
                    Connect & Swap
                  </button>
                  <button onClick={() => navigate('/browse')} className="btn btn-outline">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {selectedTeacher && (
        <RequestModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onSubmit={handleRequest}
        />
      )}

      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000,
          background: 'var(--secondary)', color: 'white', padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          fontWeight: 600, animation: 'slideUp 0.3s ease',
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
