import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateClubModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', description: '', icon: '👥' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale-in" style={{ maxWidth: '400px' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>➕ Create a Skill Club</h3>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem', fontSize: '1.2rem' }}>✕</button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Club Name *</label>
            <input type="text" className="input" placeholder="e.g. React Wizards" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Description *</label>
            <textarea className="input" rows={3} placeholder="What is this club about? Who is it for?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Emoji Icon</label>
            <input type="text" className="input" placeholder="👥" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating...' : 'Create Club'}
          </button>
        </form>
      </div>
    </div>
  );
}

function CreatePostModal({ club, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale-in">
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>✏️ Post in {club.name}</h3>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem', fontSize: '1.2rem' }}>✕</button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Post Title *</label>
            <input type="text" className="input" placeholder="e.g. Tips for beginner CSS layouts" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Content *</label>
            <textarea className="input" rows={5} placeholder="Write your post here..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Publishing...' : '🚀 Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [activeClub, setActiveClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (activeClub) {
      fetchPosts(activeClub.id);
    }
  }, [activeClub]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/communities');
      const data = res.data || [];
      setCommunities(data);
      if (data.length > 0 && !activeClub) {
        setActiveClub(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (clubId) => {
    setLoadingPosts(true);
    try {
      const res = await api.get(`/communities/${clubId}/posts`);
      setPosts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreateClub = async (payload) => {
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/auth'); return; }
    try {
      const res = await api.post('/communities', payload);
      setCommunities(prev => [res.data, ...prev]);
      setActiveClub(res.data);
      showNotification('✅ Club created successfully!');
    } catch (err) {
      throw err;
    }
  };

  const handleCreatePost = async (payload) => {
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/auth'); return; }
    try {
      const res = await api.post(`/communities/${activeClub.id}/posts`, payload);
      setPosts(prev => [res.data, ...prev]);
      showNotification('✅ Post published!');
    } catch (err) {
      throw err;
    }
  };

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const initials = (name) => name?.charAt(0)?.toUpperCase() || '?';

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
        <p className="text-muted">Loading communities...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Skill Exchange Clubs</h1>
          <p className="text-muted">Join local topic study groups, ask questions, and share study materials.</p>
        </div>
        <button onClick={() => setShowCreateClub(true)} className="btn btn-primary">
          ➕ Create Club
        </button>
      </div>
      
      {/* Communities Carousel */}
      <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: '1rem', marginBottom: '3rem' }}>
        {communities.map((club) => {
          const isActive = activeClub?.id === club.id;
          return (
            <div
              key={club.id}
              onClick={() => setActiveClub(club)}
              className="card text-center"
              style={{
                flex: '0 0 240px',
                padding: '1.5rem',
                cursor: 'pointer',
                border: isActive ? '2.5px solid var(--primary)' : '1px solid var(--border)',
                transform: isActive ? 'scale(1.02)' : 'none',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{club.icon}</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{club.name}</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>{club.memberCount} Members</p>
              <button
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%' }}
              >
                {isActive ? 'Viewing' : 'Open Forum'}
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Active Club Thread */}
      {activeClub && (
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>💬 {activeClub.name} Discussion Board</h2>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{activeClub.description}</p>
            </div>
            <button onClick={() => setShowCreatePost(true)} className="btn btn-secondary btn-sm">
              ✏️ Write Post
            </button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loadingPosts ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <span className="spinner" style={{ width: 32, height: 32 }} />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center text-muted" style={{ padding: '4rem 2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✏️</div>
                <h3>No posts yet</h3>
                <p style={{ marginTop: '0.5rem' }}>Be the first to ask a question or share tips in this club!</p>
              </div>
            ) : (
              <div>
                {posts.map((post, i) => (
                  <div key={post.id} style={{ padding: '1.5rem', borderBottom: i !== posts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="flex gap-4">
                      <div className="avatar avatar-sm">{initials(post.author?.name)}</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', fontWeight: 700 }}>{post.title}</h4>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-muted" style={{ fontSize: '0.78rem' }}>
                          <span>✍️ Posted by <strong>{post.author?.name || 'Student'}</strong></span>
                          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Club Modal */}
      {showCreateClub && (
        <CreateClubModal
          onClose={() => setShowCreateClub(false)}
          onSubmit={handleCreateClub}
        />
      )}

      {/* Create Post Modal */}
      {showCreatePost && activeClub && (
        <CreatePostModal
          club={activeClub}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
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
