import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', bio: '', university: '', location: '' });
  const [saveLoading, setSaveLoading] = useState(false);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [showAddSkill, setShowAddSkill] = useState(null); // 'TEACH' or 'LEARN' or null
  const [newSkill, setNewSkill] = useState({ skillName: '', proficiencyLevel: 'BEGINNER', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
      setEditData({
        name: res.data.name || '',
        bio: res.data.bio || '',
        university: res.data.university || '',
        location: res.data.location || '',
      });
      // Separate skills by type
      const skills = res.data.userSkills || [];
      setTeachSkills(skills.filter(s => s.type === 'TEACH'));
      setLearnSkills(skills.filter(s => s.type === 'LEARN'));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
      }
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const res = await api.put('/users/me', editData);
      setUser(res.data);
      setEditing(false);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddSkill = async (type) => {
    if (!newSkill.skillName.trim()) return;
    try {
      await api.post('/skills/user-skills', {
        skillName: newSkill.skillName,
        proficiencyLevel: newSkill.proficiencyLevel,
        description: newSkill.description,
        type: type,
      });
      setShowAddSkill(null);
      setNewSkill({ skillName: '', proficiencyLevel: 'BEGINNER', description: '' });
      fetchProfile(); // Refresh
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add skill');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', animation: 'pulse 2s infinite' }}>⏳</div>
        <p className="text-muted" style={{ marginTop: '1rem' }}>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Please sign in to view your profile</h2>
        <button onClick={() => navigate('/auth')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1>Your Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn btn-outline">✏️ Edit Profile</button>
        ) : (
          <div className="flex gap-4">
            <button onClick={handleSaveProfile} disabled={saveLoading} className="btn btn-primary">
              {saveLoading ? '💾 Saving...' : '💾 Save'}
            </button>
            <button onClick={() => setEditing(false)} className="btn btn-outline">Cancel</button>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)',
          border: '1px solid rgba(244, 63, 94, 0.2)', fontSize: '0.875rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            margin: '0 auto 1.5rem auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', color: 'white',
          }}>
            {user.name?.charAt(0)?.toUpperCase() || '?'}
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <input
                className="input" placeholder="Full Name"
                value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
              />
              <input
                className="input" placeholder="University"
                value={editData.university} onChange={e => setEditData(p => ({ ...p, university: e.target.value }))}
              />
              <input
                className="input" placeholder="Location"
                value={editData.location} onChange={e => setEditData(p => ({ ...p, location: e.target.value }))}
              />
              <textarea
                className="input" placeholder="Your bio..." rows={3}
                value={editData.bio} onChange={e => setEditData(p => ({ ...p, bio: e.target.value }))}
                style={{ resize: 'vertical' }}
              />
            </div>
          ) : (
            <>
              <h2 style={{ marginBottom: '0.25rem' }}>{user.name}</h2>
              <p className="text-muted">{user.university}</p>
              {user.location && <p className="text-muted" style={{ fontSize: '0.875rem' }}>📍 {user.location}</p>}
              {user.bio && <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>{user.bio}</p>}
              <div style={{ marginTop: '1.5rem' }} className="flex justify-center gap-4">
                <span style={{
                  padding: '0.375rem 1rem', backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: '600',
                }}>
                  Trust: {user.trustScore || 50}%
                </span>
                <span style={{
                  padding: '0.375rem 1rem', backgroundColor: 'var(--secondary-light)',
                  color: 'var(--secondary)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: '600',
                }}>
                  💰 {user.totalPoints || 0} pts
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
                {user.emailVerified ? '✅ Email Verified' : '❌ Email Not Verified'}
              </p>
            </>
          )}
        </div>

        {/* Skills Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Skills I Can Teach */}
          <div className="card">
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--secondary)' }}>🎓 Skills I Can Teach</h3>
              <button onClick={() => setShowAddSkill(showAddSkill === 'TEACH' ? null : 'TEACH')} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
                {showAddSkill === 'TEACH' ? '✕ Cancel' : '+ Add Skill'}
              </button>
            </div>

            {showAddSkill === 'TEACH' && (
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input className="input" placeholder="Skill name (e.g. React.js)"
                    value={newSkill.skillName} onChange={e => setNewSkill(p => ({ ...p, skillName: e.target.value }))} />
                  <select className="input" value={newSkill.proficiencyLevel}
                    onChange={e => setNewSkill(p => ({ ...p, proficiencyLevel: e.target.value }))}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                  <button onClick={() => handleAddSkill('TEACH')} className="btn btn-primary">Add Teaching Skill</button>
                </div>
              </div>
            )}

            {teachSkills.length > 0 ? (
              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                {teachSkills.map(s => (
                  <div key={s.id} className="card" style={{ padding: '1rem', flex: '1 1 200px', minWidth: '200px' }}>
                    <div className="flex justify-between items-center">
                      <strong>{s.skill?.name || 'Unknown'}</strong>
                      <span style={{
                        padding: '0.2rem 0.5rem', fontSize: '0.7rem',
                        backgroundColor: s.proficiencyLevel === 'EXPERT' ? 'var(--secondary-light)' : 'var(--primary-light)',
                        color: s.proficiencyLevel === 'EXPERT' ? 'var(--secondary)' : 'var(--primary)',
                        borderRadius: 'var(--radius-full)', fontWeight: '600',
                      }}>{s.proficiencyLevel}</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      ⭐ {s.avgRating.toFixed(1)} • {s.sessionCount} sessions
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No teaching skills added yet. Click "+ Add Skill" to get started!</p>
            )}
          </div>

          {/* Skills I Want to Learn */}
          <div className="card">
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--accent)' }}>📚 Skills I Want to Learn</h3>
              <button onClick={() => setShowAddSkill(showAddSkill === 'LEARN' ? null : 'LEARN')} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
                {showAddSkill === 'LEARN' ? '✕ Cancel' : '+ Add Skill'}
              </button>
            </div>

            {showAddSkill === 'LEARN' && (
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input className="input" placeholder="Skill you want to learn (e.g. Spanish)"
                    value={newSkill.skillName} onChange={e => setNewSkill(p => ({ ...p, skillName: e.target.value }))} />
                  <select className="input" value={newSkill.proficiencyLevel}
                    onChange={e => setNewSkill(p => ({ ...p, proficiencyLevel: e.target.value }))}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                  <button onClick={() => handleAddSkill('LEARN')} className="btn btn-primary">Add Learning Goal</button>
                </div>
              </div>
            )}

            {learnSkills.length > 0 ? (
              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                {learnSkills.map(s => (
                  <div key={s.id} className="card" style={{ padding: '1rem', flex: '1 1 200px', minWidth: '200px' }}>
                    <strong>{s.skill?.name || 'Unknown'}</strong>
                    <span style={{
                      marginLeft: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.7rem',
                      backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                      borderRadius: 'var(--radius-full)', fontWeight: '600',
                    }}>{s.proficiencyLevel}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No learning goals added yet. What do you want to learn?</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
