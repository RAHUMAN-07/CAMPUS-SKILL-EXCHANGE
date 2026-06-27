import React, { useEffect, useState } from 'react';
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
import Partners from './pages/Partners';
import api from './services/api';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [connectingSkill, setConnectingSkill] = useState(null);
  const [connectionRequest, setConnectionRequest] = useState({ topic: '', scheduledAt: '', durationMinutes: 60, message: '' });
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillLoading, setSkillLoading] = useState(false);
  const [matchedTeachers, setMatchedTeachers] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState({ email: '', password: '' });
  const [authMessage, setAuthMessage] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const stats = [
    { label: 'Active Students', value: '1,240+', icon: <BiGroup /> },
    { label: 'Skills Exchanged', value: '4,850 hrs', icon: <BiBookOpen /> },
    { label: 'Completed Sessions', value: '3,200+', icon: <BiCalendar /> },
    { label: 'Verified Badges', value: '450+', icon: <BiBadgeCheck /> },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAllSkills = (event) => {
    event.preventDefault();
    scrollToSection('skills-section');
  };

  const fetchSkills = async (query = '') => {
    setSkillLoading(true);
    try {
      const response = await api.get('/skills/search', {
        params: { query, page: 1, limit: 12 }
      });
      setSkills(response.data.skills || []);
    } catch (error) {
      setConnectionStatus({
        type: 'error',
        text: error.response?.data?.error || 'Unable to load skills.'
      });
    } finally {
      setSkillLoading(false);
    }
  };

  const fetchMatchForSkill = async (skillId) => {
    setMatchLoading(true);
    try {
      const response = await api.get('/match/search', {
        params: { skillId, page: 1, limit: 10 }
      });
      setMatchedTeachers(response.data.results || []);
    } catch (error) {
      setConnectionStatus({
        type: 'error',
        text: error.response?.data?.error || 'Unable to load teacher matches.'
      });
    } finally {
      setMatchLoading(false);
    }
  };

  const handleSkillCardClick = (skill) => {
    setSelectedSkill(skill);
    setMatchedTeachers([]);
    if (skill.id) {
      fetchMatchForSkill(skill.id);
    }
    scrollToSection('skill-detail');
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/match/recommendations');
      setRecommendations(response.data || []);
    } catch (error) {
      setConnectionStatus({
        type: 'error',
        text: error.response?.data?.error || 'Unable to load recommended peers.'
      });
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      await fetchRecommendations();
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  useEffect(() => {
    fetchSkills();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSkills(searchQuery);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthState((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setAuthMessage(null);
    setAuthLoading(true);

    try {
      const response = await api.post('/auth/login', authState);
      const { user: loggedInUser, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(loggedInUser);
      setAuthMessage({ type: 'success', text: `Welcome back, ${loggedInUser.name}!` });
      await fetchRecommendations();
    } catch (error) {
      setAuthMessage({
        type: 'error',
        text: error.response?.data?.error || 'Login failed. Check your credentials.'
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setRecommendations([]);
    setAuthMessage({ type: 'success', text: 'You have been logged out.' });
  };

  const handleConnectClick = (teacher) => {
    setConnectingSkill(teacher);
    setConnectionStatus(null);
    setConnectionRequest({ topic: '', scheduledAt: '', durationMinutes: 60, message: '' });
    scrollToSection('connect-section');
  };

  const handleConnectionChange = (event) => {
    const { name, value } = event.target;
    setConnectionRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendConnectionRequest = async (event) => {
    event.preventDefault();
    if (!connectionRequest.scheduledAt) {
      setConnectionStatus({ type: 'error', text: 'Please select a date and time for the session.' });
      return;
    }
    if (!user || !connectingSkill) {
      setConnectionStatus({ type: 'error', text: 'Please log in and choose a recommended peer first.' });
      return;
    }

    setRequestLoading(true);
    setConnectionStatus(null);

    try {
      await api.post('/sessions', {
        teacherId: connectingSkill.user.id,
        skillId: connectingSkill.skill.id,
        scheduledAt: connectionRequest.scheduledAt,
        durationMinutes: Number(connectionRequest.durationMinutes),
        topic: connectionRequest.topic,
        message: connectionRequest.message,
      });
      setConnectionStatus({
        type: 'success',
        text: `Your session request was sent to ${connectingSkill.user.name}. They can now accept or decline.`
      });
      setConnectingSkill(null);
    } catch (error) {
      setConnectionStatus({
        type: 'error',
        text: error.response?.data?.error || 'Unable to send the session request. Please try again.'
      });
    } finally {
      setRequestLoading(false);
    }
  };

  // If Partners page is selected, render it instead
  if (currentPage === 'partners') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc',
      }}>
        {/* Header */}
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
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
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
              fontWeight: 'bold'
            }}>
              🎓
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: darkMode ? '#ffffff' : '#1e3a5f', margin: 0 }}>
                CAMPUS<span style={{ color: '#d4a843' }}>SKILL</span>
              </h1>
            </div>
          </button>

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
                backgroundColor: darkMode ? '#1e293b' : '#f1f5f9'
              }}
            >
              {darkMode ? <BiSun /> : <BiMoon />}
            </button>
          </div>
        </header>
        <Partners darkMode={darkMode} />
      </div>
    );
  }

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
            onClick={() => setCurrentPage('partners')}
            style={{
              backgroundColor: '#d4a843',
              color: '#1e3a5f',
              border: 'none',
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginRight: '0.5rem'
            }}
          >
            For Partners
          </button>
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
          
          <button
            onClick={() => scrollToSection('skills-section')}
            style={{
              backgroundColor: '#1e3a5f',
              color: '#ffffff',
              border: 'none',
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 58, 95, 0.15)',
              transition: 'transform var(--transition-fast)'
            }}
          >
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

      <section style={{
        padding: '3rem 2rem',
        backgroundColor: darkMode ? '#0b1120' : '#ffffff',
        borderBottom: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem'
        }}>
          <div style={{
            padding: '2rem',
            borderRadius: '24px',
            backgroundColor: darkMode ? '#111827' : '#f8fafc',
            boxShadow: darkMode ? '0 20px 45px rgba(0, 0, 0, 0.25)' : '0 20px 45px rgba(15, 23, 42, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e3a5f' }}>Real peer connections start here</h3>
                <p style={{ color: darkMode ? '#94a3b8' : '#475569', marginTop: '0.75rem', maxWidth: '700px' }}>
                  Log in to see recommended peer experts matched to what you want to learn. Then send a session request directly from the dashboard.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {user ? (
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: '#d4a843',
                      color: '#1e3a5f',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => scrollToSection('login-section')}
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: '#1e3a5f',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Login to Connect
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem'
          }}>
            {!user ? (
              <div id="login-section" style={{
                padding: '2rem',
                borderRadius: '24px',
                backgroundColor: darkMode ? '#111827' : '#f8fafc',
                boxShadow: darkMode ? '0 20px 45px rgba(0, 0, 0, 0.15)' : '0 20px 45px rgba(15, 23, 42, 0.05)'
              }}>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e3a5f' }}>Login to Start a Session</h4>
                <p style={{ color: darkMode ? '#94a3b8' : '#475569', margin: '0.75rem 0 1.5rem' }}>
                  Use your registered email and password to access recommendations and send session requests.
                </p>
                <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '1rem' }}>
                  <input
                    name="email"
                    type="email"
                    value={authState.email}
                    onChange={handleAuthChange}
                    placeholder="Email"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '14px',
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      backgroundColor: darkMode ? '#0f1729' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#0f172a'
                    }}
                  />
                  <input
                    name="password"
                    type="password"
                    value={authState.password}
                    onChange={handleAuthChange}
                    placeholder="Password"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '14px',
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      backgroundColor: darkMode ? '#0f1729' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#0f172a'
                    }}
                  />
                  {authMessage && (
                    <div style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      backgroundColor: authMessage.type === 'error' ? '#fee2e2' : '#d1fae5',
                      color: authMessage.type === 'error' ? '#991b1b' : '#065f46'
                    }}>
                      {authMessage.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      padding: '1rem 1.5rem',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: '#1e3a5f',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {authLoading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              </div>
            ) : (
              <div style={{
                padding: '2rem',
                borderRadius: '24px',
                backgroundColor: darkMode ? '#111827' : '#f8fafc',
                boxShadow: darkMode ? '0 20px 45px rgba(0, 0, 0, 0.15)' : '0 20px 45px rgba(15, 23, 42, 0.05)'
              }}>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e3a5f' }}>Recommended Peer Matches</h4>
                <p style={{ color: darkMode ? '#94a3b8' : '#475569', margin: '0.75rem 0 1.5rem' }}>
                  These are the best recommended peers based on your current learning interests.
                </p>
                {recommendations.length === 0 ? (
                  <div style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                    No recommendations available yet. Complete your profile or add learn skills to get better matches.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {recommendations.map((teacher) => (
                      <div key={teacher.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.25rem',
                        borderRadius: '18px',
                        backgroundColor: darkMode ? '#0f1729' : '#ffffff',
                        border: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#1e3a5f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {teacher.user.name[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: darkMode ? '#ffffff' : '#1e3a5f' }}>{teacher.user.name}</div>
                              <div style={{ fontSize: '0.9rem', color: darkMode ? '#94a3b8' : '#64748b' }}>{teacher.skill.name} • {teacher.skill.category.name}</div>
                            </div>
                          </div>
                          <div style={{ marginTop: '0.75rem', color: darkMode ? '#cbd5e1' : '#475569' }}>
                            Match score: {teacher.matchScore} • Rating {teacher.avgRating ?? '4.8'}
                          </div>
                        </div>
                        <button
                          onClick={() => handleConnectClick(teacher)}
                          style={{
                            padding: '0.85rem 1.25rem',
                            borderRadius: '14px',
                            border: 'none',
                            backgroundColor: '#d4a843',
                            color: '#1e3a5f',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Skills / Cards */}
      <section
        id="skills-section"
        style={{
          padding: '5rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Explore Skills</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', marginTop: '0.25rem' }}>Discover instructor-led skills available now for one-on-one learning sessions.</p>
          </div>
          <a
            href="#skills-section"
            onClick={handleViewAllSkills}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#d4a843',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            View All Skills <BiChevronRight />
          </a>
        </div>

        {skillLoading ? (
          <div style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>Loading skills...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {skills.length === 0 ? (
              <div style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>No skills found for this search term.</div>
            ) : (
              skills.map((skill) => (
                <div 
                  key={skill.id}
                  onClick={() => handleSkillCardClick(skill)}
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.85)',
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
                    {skill.category?.name || 'General'}
                  </div>

                  <h4 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    lineHeight: '1.3',
                    color: darkMode ? '#ffffff' : '#1e3a5f'
                  }}>
                    {skill.name}
                  </h4>

                  <p style={{ color: darkMode ? '#cbd5e1' : '#475569', lineHeight: '1.7' }}>
                    {skill._count?.userSkills ?? 0} available peer experts teaching this skill
                  </p>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`,
                    paddingTop: '1rem',
                    marginTop: 'auto'
                  }}>
                    <span style={{ fontSize: '0.85rem' }}>{skill._count?.userSkills} teachers</span>
                    <span style={{ fontSize: '0.85rem' }}>{skill.category?.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {selectedSkill && (
        <section
          id="skill-detail"
          style={{
            padding: '2rem',
            maxWidth: '1100px',
            margin: '0 auto',
            borderTop: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
            backgroundColor: darkMode ? '#0f1729' : '#ffffff'
          }}
        >
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e3a5f' }}>
            {selectedSkill.name}
          </h3>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', marginTop: '0.5rem' }}>
            Learn with one of the top campus peers teaching {selectedSkill.name}. Scroll to the match list and send a request to book your first session.
          </p>

          {matchLoading ? (
            <div style={{ marginTop: '1.5rem', color: darkMode ? '#cbd5e1' : '#475569' }}>Loading teacher matches...</div>
          ) : (
            <div style={{
              marginTop: '2rem',
              display: 'grid',
              gap: '1.5rem'
            }}>
              {matchedTeachers.length === 0 ? (
                <div style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                  No teachers found for this skill yet. Try another skill or broaden your search.
                </div>
              ) : (
                matchedTeachers.map((teacherMatch) => (
                  <div key={teacherMatch.id} style={{
                    padding: '1.5rem',
                    borderRadius: '20px',
                    border: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
                    backgroundColor: darkMode ? '#111827' : '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '50%',
                          backgroundColor: '#1e3a5f',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1rem'
                        }}>
                          {teacherMatch.user.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e3a5f' }}>
                            {teacherMatch.user.name}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {teacherMatch.user.university} • {teacherMatch.avgRating?.toFixed(1) ?? '4.8'} ⭐
                          </div>
                        </div>
                      </div>
                      <p style={{ marginTop: '0.9rem', color: darkMode ? '#cbd5e1' : '#475569', maxWidth: '720px', lineHeight: 1.7 }}>
                        {teacherMatch.user.bio || 'Passionate peer educator with strong campus teaching experience.'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleConnectClick(teacherMatch)}
                      style={{
                        padding: '1rem 1.35rem',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: '#d4a843',
                        color: '#1e3a5f',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Request Session
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      )}

      {selectedSkill && (
        <section
          id="skill-detail"
          style={{
            padding: '2rem',
            maxWidth: '1100px',
            margin: '0 auto',
            borderTop: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
            backgroundColor: darkMode ? '#0f1729' : '#ffffff'
          }}
        >
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e3a5f' }}>
            Selected Skill Details
          </h3>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b', marginTop: '0.5rem' }}>
            You selected <strong>{selectedSkill.name}</strong> from {selectedSkill.provider}. Use the skill card to explore more and connect with peers.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem' }}>
            {selectedSkill.tags.map((tag, idx) => (
              <span key={idx} style={{
                backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                color: darkMode ? '#d4d4d8' : '#0f172a',
                padding: '0.5rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.9rem'
              }}>
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => setSelectedSkill(null)}
            style={{
              marginTop: '1.75rem',
              backgroundColor: '#1e3a5f',
              color: '#ffffff',
              border: 'none',
              padding: '0.9rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Clear Selection
          </button>
        </section>
      )}

      {connectingSkill && (
        <section
          id="connect-section"
          style={{
            padding: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            borderTop: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
            backgroundColor: darkMode ? '#111827' : '#f8fafc'
          }}
        >
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#1e3a5f' }}>
            Connect with {connectingSkill.provider}
          </h3>
          <p style={{ color: darkMode ? '#94a3b8' : '#475569', marginTop: '0.75rem' }}>
            Request a session for <strong>{connectingSkill.name}</strong> and set a preferred date and duration.
          </p>

          <form onSubmit={handleSendConnectionRequest} style={{
            display: 'grid',
            gap: '1.5rem',
            marginTop: '1.75rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Session Topic</label>
              <input
                type="text"
                name="topic"
                value={connectionRequest.topic}
                onChange={handleConnectionChange}
                placeholder="E.g. React hooks, statistical analysis"
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  backgroundColor: darkMode ? '#0f1729' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#0f172a'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={connectionRequest.scheduledAt}
                  onChange={handleConnectionChange}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: '12px',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    backgroundColor: darkMode ? '#0f1729' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#0f172a'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Duration (minutes)</label>
                <select
                  name="durationMinutes"
                  value={connectionRequest.durationMinutes}
                  onChange={handleConnectionChange}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: '12px',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    backgroundColor: darkMode ? '#0f1729' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#0f172a'
                  }}
                >
                  <option value={30}>30</option>
                  <option value={60}>60</option>
                  <option value={120}>120</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Message for {connectingSkill.provider}</label>
              <textarea
                name="message"
                value={connectionRequest.message}
                onChange={handleConnectionChange}
                rows="4"
                placeholder="Write a short note explaining why you want this session."
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  backgroundColor: darkMode ? '#0f1729' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#0f172a'
                }}
              />
            </div>

            {connectionStatus && (
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: connectionStatus.type === 'error' ? '#fee2e2' : '#d1fae5',
                color: connectionStatus.type === 'error' ? '#991b1b' : '#065f46'
              }}>
                {connectionStatus.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                style={{
                  padding: '1rem 1.75rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#1e3a5f',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Send Session Request
              </button>
              <button
                type="button"
                onClick={() => setConnectingSkill(null)}
                style={{
                  padding: '1rem 1.75rem',
                  borderRadius: '12px',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  backgroundColor: 'transparent',
                  color: darkMode ? '#ffffff' : '#0f172a',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

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
