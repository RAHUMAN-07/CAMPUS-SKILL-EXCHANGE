import React, { useState } from 'react';
import { 
  BiSearch, 
  BiBookOpen, 
  BiChevronRight, 
  BiCalendar, 
  BiStar, 
  BiBadgeCheck, 
  BiGroup, 
  BiMoon, 
  BiSun 
} from 'react-icons/bi';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const sampleSkills = [
    { id: 1, name: 'React & Frontend development', category: 'Software Development', provider: 'Alex Rivera', rating: 4.9, sessions: 24, tags: ['React', 'JavaScript', 'CSS'] },
    { id: 2, name: 'Data Structures & Algorithms', category: 'Computer Science', provider: 'Samantha Chen', rating: 5.0, sessions: 38, tags: ['Python', 'DSA', 'LeetCode'] },
    { id: 3, name: 'UI/UX Design & Prototyping', category: 'Design', provider: 'Marcus Johnson', rating: 4.8, sessions: 19, tags: ['Figma', 'UI/UX', 'Wireframing'] },
    { id: 4, name: 'Applied Statistical Analysis', category: 'Mathematics', provider: 'Elena Rostova', rating: 4.7, sessions: 12, tags: ['R', 'Probability', 'Stats'] },
  ];

  const stats = [
    { label: 'Active Students', value: '1,240+', icon: <BiGroup /> },
    { label: 'Skills Exchanged', value: '4,850 hrs', icon: <BiBookOpen /> },
    { label: 'Completed Sessions', value: '3,200+', icon: <BiCalendar /> },
    { label: 'Verified Badges', value: '450+', icon: <BiBadgeCheck /> },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      transition: 'background-color var(--transition-normal), color var(--transition-normal)'
    }}>
      {/* Header / Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        borderBottom: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
        backgroundColor: darkMode ? 'rgba(10, 15, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            backgroundColor: '#1e3a5f',
            color: '#d4a843',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)'
          }}>
            🎓
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: darkMode ? '#ffffff' : '#1e3a5f' }}>
              CAMPUS<span style={{ color: '#d4a843' }}>SKILL</span>
            </h1>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', tracking: '0.1em', fontWeight: 600, color: darkMode ? '#94a3b8' : '#475569' }}>
              Exchange Network
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: darkMode ? '#f0d78c' : '#1e3a5f',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: '50%',
              backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
              transition: 'background-color var(--transition-fast)'
            }}
          >
            {darkMode ? <BiSun /> : <BiMoon />}
          </button>
          
          <button style={{
            backgroundColor: '#1e3a5f',
            color: '#ffffff',
            border: 'none',
            padding: '0.625rem 1.25rem',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.15)',
            transition: 'transform var(--transition-fast)'
          }}>
            Launch App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{
          backgroundColor: darkMode ? 'rgba(212, 168, 67, 0.1)' : 'rgba(30, 58, 95, 0.05)',
          color: '#d4a843',
          padding: '0.375rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          border: '1px solid rgba(212, 168, 67, 0.2)'
        }}>
          ✨ Peer-to-Peer Knowledge Sharing for University Students
        </div>
        <h2 style={{
          fontSize: '3.25rem',
          fontWeight: 900,
          lineHeight: '1.15',
          letterSpacing: '-0.03em',
          maxWidth: '800px',
          color: darkMode ? '#ffffff' : '#0f172a'
        }}>
          Learn what you want, <br />
          <span style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #d4a843 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>teach what you love.</span>
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: darkMode ? '#94a3b8' : '#475569',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Connect with peers on campus to exchange skills, schedule study sessions, unlock verified badges, and build your trust profile.
        </p>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '580px',
          marginTop: '1.5rem'
        }}>
          <input 
            type="text" 
            placeholder="Search skills (e.g. React, Python, UI/UX, Figma...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              borderRadius: '12px',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              backgroundColor: darkMode ? '#111827' : '#ffffff',
              color: darkMode ? '#ffffff' : '#0f172a',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          <BiSearch style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.35rem',
            color: darkMode ? '#64748b' : '#94a3b8'
          }} />
        </div>
      </section>

      {/* Stats Counter */}
      <section style={{
        padding: '2rem 1.5rem',
        backgroundColor: darkMode ? '#111827' : '#f1f5f9',
        borderTop: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
        borderBottom: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ fontSize: '1.5rem', color: '#d4a843', marginBottom: '0.25rem' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: darkMode ? '#ffffff' : '#1e3a5f' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: darkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Skills / Cards */}
      <section style={{
        padding: '5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Explore Skills</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>Discover what fellow students are teaching on campus.</p>
          </div>
          <a href="#" style={{
            display: 'flex',
            alignItems: 'center',
            color: '#d4a843',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}>
            View All Skills <BiChevronRight />
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {sampleSkills
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
            .map((skill) => (
              <div 
                key={skill.id} 
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.75)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(30, 58, 95, 0.08)'}`,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#d4a843',
                  letterSpacing: '0.05em'
                }}>
                  {skill.category}
                </div>
                
                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  color: darkMode ? '#ffffff' : '#1e3a5f'
                }}>
                  {skill.name}
                </h4>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <div style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: '50%',
                    backgroundColor: darkMode ? '#334155' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}>
                    {skill.provider[0]}
                  </div>
                  <span style={{ fontWeight: 500 }}>{skill.provider}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.85rem',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`,
                  paddingTop: '1rem',
                  marginTop: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <BiStar style={{ color: '#d4a843' }} />
                    <strong style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>{skill.rating}</strong>
                  </div>
                  <div>
                    {skill.sessions} sessions
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '3rem 2rem',
        backgroundColor: darkMode ? '#070a12' : '#0f1729',
        color: '#94a3b8',
        borderTop: `1px solid ${darkMode ? '#1e293b' : '#1e3a5f'}`
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Campus Skill Exchange</h5>
            <p style={{ fontSize: '0.875rem' }}>Peer-to-peer knowledge sharing and collaboration platform.</p>
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            &copy; 2026 Campus Skill Exchange Network. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
