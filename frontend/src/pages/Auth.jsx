import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import api from '../services/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/profile');
      } else {
        const res = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          university: formData.university,
        });
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setSuccess('Account created! Redirecting...');
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Join CampusSkills'}
          </h1>
          <p className="text-muted">
            {isLogin ? 'Sign in to continue learning & teaching' : 'Create your account and start exchanging skills'}
          </p>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--accent)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            fontSize: '0.875rem',
          }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--secondary)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '0.875rem',
          }}>
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>University</label>
                <input
                  type="text"
                  name="university"
                  className="input"
                  placeholder="MIT, Stanford, etc."
                  value={formData.university}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Email</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="you@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.875rem',
              fontSize: '1rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ textAlign: 'center', marginTop: '2rem' }} className="text-muted">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up for free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
