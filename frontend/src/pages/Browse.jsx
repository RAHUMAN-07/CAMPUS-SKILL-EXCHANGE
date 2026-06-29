import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['All', 'Programming', 'Design', 'Languages', 'Music', 'Mathematics', 'Science', 'Business', 'Data & AI', 'Writing', 'Photography & Video', 'Health & Fitness', 'Life Skills'];


function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: '40%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 12, width: '80%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '55%', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: 38, borderRadius: 8 }} />
    </div>
  );
}

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
        skillId: parseInt(form.skillId),
        scheduledAt: form.scheduledAt,
        durationMinutes: parseInt(form.durationMinutes),
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

  // Min date = now
  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());
  const minStr = minDate.toISOString().slice(0, 16);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale-in">
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>📬 Request Session</h3>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem', fontSize: '1.2rem' }}>✕</button>
        </div>

        {/* Teacher info */}
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Message to Teacher</label>
            <textarea className="input" rows={3} placeholder="Hi! I'd love to learn..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Sending...</> : '🚀 Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Browse() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('skill') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [toast, setToast] = useState('');

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (query.trim()) params.skill = query.trim();
      if (category !== 'All') params.category = category;
      const res = await api.get('/match/search', { params });
      setTeachers(res.data.teachers || res.data || []);
    } catch (err) {
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    const t = setTimeout(fetchTeachers, 400);
    return () => clearTimeout(t);
  }, [fetchTeachers]);

  const handleRequest = async (payload) => {
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/auth'); return; }
    await api.post('/sessions', payload);
    setToast('✅ Session request sent!');
    setTimeout(() => setToast(''), 3000);
  };

  const initials = (name) => name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '0.5rem' }}>
            🔍 Browse <span className="text-gradient">Skill Teachers</span>
          </h1>
          <p className="text-muted">Find peers who can teach you something new</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            className="input"
            placeholder="🔍  Search by skill name (e.g. React, Spanish, Guitar)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: '1 1 280px', minWidth: 0 }}
          />
          <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ flex: '0 1 200px' }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={fetchTeachers} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Search</button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="badge"
              style={{
                cursor: 'pointer', padding: '0.4rem 1rem', fontSize: '0.8rem',
                background: category === c ? 'var(--gradient-primary)' : 'var(--bg-surface)',
                color: category === c ? 'white' : 'var(--text-muted)',
                border: `1px solid ${category === c ? 'transparent' : 'var(--border)'}`,
                boxShadow: category === c ? 'var(--shadow-glow)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >{c}</button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {teachers.length > 0 ? `Found ${teachers.length} teacher${teachers.length !== 1 ? 's' : ''}` : ''}
          </p>
        )}

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>⚠️ {error}</div>}

        {/* Grid */}
        <div className="grid md:grid-cols-3" style={{ gap: '1.25rem' }}>
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : teachers.length > 0
              ? teachers.map(teacher => (
                  <div key={teacher.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-md">{initials(teacher.name)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacher.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.775rem' }}>🏫 {teacher.university || 'Campus'}</div>
                      </div>
                      <div className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        ⭐ {teacher.trustScore ? Math.round(teacher.trustScore) + '%' : 'New'}
                      </div>
                    </div>

                    {/* Skills he teaches */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Teaches</div>
                      <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                        {(teacher.teachSkills || []).slice(0, 3).map(ts => (
                          <span key={ts.skillId} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                            {ts.skill?.name || 'Skill'}
                          </span>
                        ))}
                        {(teacher.teachSkills || []).length === 0 && <span className="text-muted" style={{ fontSize: '0.8rem' }}>No skills listed</span>}
                      </div>
                    </div>

                    {/* Bio snippet */}
                    {teacher.bio && (
                      <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {teacher.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-3" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>📚 {teacher.totalSessions || 0} sessions</span>
                      <span>⭐ {teacher.avgRating ? teacher.avgRating.toFixed(1) : 'New'}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2" style={{ marginTop: 'auto' }}>
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className="btn btn-primary flex-1"
                        disabled={!teacher.teachSkills?.length}
                      >
                        📬 Request Swap
                      </button>
                      <button
                        onClick={() => navigate(`/profile`)}
                        className="btn btn-outline"
                        style={{ padding: '0.625rem 0.75rem' }}
                        title="View Profile"
                      >
                        👤
                      </button>
                    </div>
                  </div>
                ))
              : (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="card empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3 style={{ marginBottom: '0.75rem' }}>No teachers found</h3>
                    <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                      {query ? `No one teaching "${query}" yet. Try a different search term.` : 'No users found for this category yet.'}
                    </p>
                    <button onClick={() => { setQuery(''); setCategory('All'); }} className="btn btn-outline">Clear Filters</button>
                  </div>
                </div>
              )
          }
        </div>
      </div>

      {/* Request Modal */}
      {selectedTeacher && (
        <RequestModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onSubmit={handleRequest}
        />
      )}

      {/* Toast */}
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
