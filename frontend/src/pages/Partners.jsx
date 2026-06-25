import React, { useState } from 'react';
import { BiBuilding, BiCheckCircle, BiTrendingUp, BiUsers, BiStar } from 'react-icons/bi';

export default function Partners({ darkMode }) {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    pocName: '',
    designation: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        companyName: '',
        industry: '',
        pocName: '',
        designation: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 3000);
  };

  const benefits = [
    {
      icon: <BiUsers />,
      title: 'Access Certified Talent',
      description: 'Connect with verified students who have demonstrated expertise in your required skills.'
    },
    {
      icon: <BiCheckCircle />,
      title: 'Pre-Assessed Professionals',
      description: 'All candidates are peer-reviewed and rated by fellow students for quality assurance.'
    },
    {
      icon: <BiTrendingUp />,
      title: 'Cost-Effective Recruitment',
      description: 'Significantly reduce hiring costs while accessing high-potential emerging talent.'
    },
    {
      icon: <BiStar />,
      title: 'Verified Badges & Ratings',
      description: 'Review detailed skill profiles with verified badges and session ratings.'
    }
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Design',
    'Marketing',
    'Consulting',
    'Other'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc',
      color: darkMode ? '#f1f5f9' : '#0f172a',
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem 4rem',
        background: `linear-gradient(135deg, ${darkMode ? '#1e3a5f' : '#1e3a5f'} 0%, ${darkMode ? '#2d5a8c' : '#2d5a8c'} 100%)`,
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <BiBuilding style={{ fontSize: '2rem', color: '#d4a843' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              Partner With Campus Skill Exchange
            </h1>
          </div>
          <p style={{
            fontSize: '1.25rem',
            color: '#e2e8f0',
            marginTop: '1rem',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '1rem auto 0'
          }}>
            Build your workforce from a <strong>certified talent pool</strong> of verified, peer-assessed students ready to contribute to your organization.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{
        padding: '5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '3rem',
          color: darkMode ? '#ffffff' : '#1e3a5f'
        }}>
          Why Partner With Us?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              style={{
                padding: '2rem',
                borderRadius: '16px',
                backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.75)',
                border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(30, 58, 95, 0.08)'}`,
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                color: '#d4a843'
              }}>
                {benefit.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: darkMode ? '#ffffff' : '#1e3a5f',
                margin: 0
              }}>
                {benefit.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: darkMode ? '#94a3b8' : '#64748b',
                lineHeight: '1.6',
                margin: 0
              }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form Section */}
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: darkMode ? '#111827' : '#f1f5f9'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '1rem',
            color: darkMode ? '#ffffff' : '#1e3a5f'
          }}>
            Register Your Organization
          </h2>
          <p style={{
            textAlign: 'center',
            color: darkMode ? '#94a3b8' : '#64748b',
            marginBottom: '3rem',
            fontSize: '1rem'
          }}>
            Complete this form to access our certified talent pool and connect with verified candidates.
          </p>

          {submitted ? (
            <div style={{
              padding: '2rem',
              backgroundColor: '#d1fae5',
              border: '1px solid #6ee7b7',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#065f46'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                ✓ Registration Submitted!
              </h3>
              <p>Thank you for registering. Our team will review your application and contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'grid',
              gap: '2rem',
              backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.75)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(30, 58, 95, 0.08)'}`
            }}>
              {/* Company Details Section */}
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  color: '#d4a843',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Company Details
                </h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your company name"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        backgroundColor: darkMode ? '#111827' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#0f172a',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      Industry Type *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        backgroundColor: darkMode ? '#111827' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#0f172a',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="">-- Select Industry --</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Point of Contact Section */}
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  color: '#d4a843',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Point of Contact Details
                </h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="pocName"
                      value={formData.pocName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        backgroundColor: darkMode ? '#111827' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#0f172a',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }}>
                        Designation *
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        placeholder="e.g., HR Manager"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                          backgroundColor: darkMode ? '#111827' : '#ffffff',
                          color: darkMode ? '#ffffff' : '#0f172a',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                          backgroundColor: darkMode ? '#111827' : '#ffffff',
                          color: darkMode ? '#ffffff' : '#0f172a',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      Email Address (Official) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@company.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        backgroundColor: darkMode ? '#111827' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#0f172a',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your recruitment needs..."
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        backgroundColor: darkMode ? '#111827' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#0f172a',
                        fontSize: '1rem',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                paddingTop: '1rem'
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: '#1e3a5f',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 4px 12px rgba(30, 58, 95, 0.15)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(30, 58, 95, 0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 95, 0.15)';
                  }}
                >
                  Register Now
                </button>
              </div>

              <p style={{
                fontSize: '0.85rem',
                color: darkMode ? '#94a3b8' : '#64748b',
                textAlign: 'center'
              }}>
                By registering, you agree to our privacy policy and terms of service.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        backgroundColor: darkMode ? '#0f1729' : '#1e3a5f',
        color: '#ffffff'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          marginBottom: '1rem'
        }}>
          Ready to Connect With Top Talent?
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#e2e8f0',
          marginBottom: '2rem'
        }}>
          Join hundreds of organizations building their workforce through Campus Skill Exchange.
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            style={{
              padding: '0.9rem 2rem',
              backgroundColor: '#d4a843',
              color: '#1e3a5f',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Contact Sales
          </button>
          <button
            style={{
              padding: '0.9rem 2rem',
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '2px solid #d4a843',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}
