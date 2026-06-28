import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FEATURES = [
  { icon: '🎯', title: 'Smart Matching', desc: 'Our algorithm finds peers with perfectly complementary teach/learn skill pairs — real matches, not random users.' },
  { icon: '🔄', title: 'Skill Swap', desc: 'Trade what you know for what you want to learn. No money needed — just knowledge exchange.' },
  { icon: '📅', title: 'Easy Scheduling', desc: 'Request sessions, set your availability, and confirm bookings in seconds.' },
  { icon: '⭐', title: 'Ratings & Trust', desc: 'After every session, rate your peer. Build a trusted reputation on campus.' },
  { icon: '🔔', title: 'Live Notifications', desc: 'Get instant alerts for session requests, acceptances, and messages.' },
  { icon: '🛡️', title: 'Admin Moderation', desc: 'Our team reviews flagged content to keep the platform safe for everyone.' },
];

const SKILLS = [
  { emoji: '💻', name: 'Programming', count: 124 },
  { emoji: '🎨', name: 'Design', count: 87 },
  { emoji: '🗣️', name: 'Languages', count: 63 },
  { emoji: '📊', name: 'Data Science', count: 51 },
  { emoji: '🎵', name: 'Music', count: 44 },
  { emoji: '📐', name: 'Mathematics', count: 38 },
];

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: '2,000+', sessions: '5,400+', skills: '320+' });
  const token = localStorage.getItem('accessToken');

  return (
    <div className="animate-fade-in">
      {/* ── Hero Section ── */}
      <section className="hero-bg" style={{ padding: '7rem 1.5rem 5rem', color: 'white', textAlign: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div className="section-tag" style={{ margin: '0 auto 1.5rem auto', display: 'inline-flex', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            🚀 Campus Skill Exchange Platform
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            <span className="text-gradient-hero">Learn, Teach,</span>
            <br />& Grow Together
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto 2.5rem auto', lineHeight: 1.7 }}>
            Join the ultimate peer-to-peer skill swap platform for university students. Trade your expertise for skills you want to master — for free.
          </p>

          <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
            {token ? (
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/auth')} className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--primary)', boxShadow: '0 8px 30px rgba(255,255,255,0.25)' }}>
                  🎓 Join for Free
                </button>
                <button onClick={() => navigate('/browse')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
                  Browse Skills
                </button>
              </>
            )}
          </div>
        </div>

        {/* Floating orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent)', filter: 'blur(30px)', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.3), transparent)', filter: 'blur(40px)', animation: 'float 8s ease-in-out infinite 2s' }} />
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
        <div className="container">
          <div className="grid grid-cols-3" style={{ gap: '1rem', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            {[
              { value: stats.users, label: 'Students Joined' },
              { value: stats.sessions, label: 'Sessions Completed' },
              { value: stats.skills, label: 'Skills Available' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {stat.value}
                </div>
                <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skill Categories ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <div className="section-tag" style={{ margin: '0 auto 1rem auto' }}>Popular Categories</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Explore Skills by Category</h2>
            <p className="text-muted" style={{ marginTop: '0.75rem', maxWidth: 500, margin: '0.75rem auto 0' }}>
              From coding to creative arts — find peers who can teach you something new.
            </p>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: '1rem' }}>
            {SKILLS.map(skill => (
              <button
                key={skill.name}
                onClick={() => navigate(`/browse?category=${skill.name}`)}
                className="card flex items-center gap-4"
                style={{ cursor: 'pointer', padding: '1.25rem 1.5rem', textAlign: 'left', width: '100%', border: 'none' }}
              >
                <span style={{ fontSize: '2rem' }}>{skill.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{skill.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>{skill.count} listings</div>
                </div>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ background: 'var(--bg-surface)', padding: '5rem 1.5rem' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <div className="section-tag" style={{ margin: '0 auto 1rem auto' }}>Platform Features</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Everything You Need</h2>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: '1.5rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card card-gradient" style={{ padding: '2rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                  marginBottom: '1.25rem',
                }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>{f.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <div className="section-tag" style={{ margin: '0 auto 1rem auto' }}>How It Works</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>3 Steps to Swap Skills</h2>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: '2rem', textAlign: 'center' }}>
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Add skills you can teach and skills you want to learn. Set your availability.' },
              { step: '02', title: 'Find a Match', desc: 'Browse or search for users who teach what you want. Send a swap request.' },
              { step: '03', title: 'Exchange & Grow', desc: 'Accept, schedule your session, meet online, and rate each other after.' },
            ].map(s => (
              <div key={s.step} style={{ padding: '2rem 1rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  fontWeight: 900, fontSize: '1rem', margin: '0 auto 1.5rem auto',
                  boxShadow: 'var(--shadow-glow)',
                }}>{s.step}</div>
                <h3 style={{ marginBottom: '0.75rem' }}>{s.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      {!token && (
        <section className="hero-bg" style={{ padding: '5rem 1.5rem', textAlign: 'center', color: 'white' }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
              Ready to Start Learning?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Join thousands of students already swapping skills on CampusSkills.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="btn btn-lg"
              style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, boxShadow: '0 8px 30px rgba(255,255,255,0.25)' }}
            >
              🚀 Get Started — It's Free
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
