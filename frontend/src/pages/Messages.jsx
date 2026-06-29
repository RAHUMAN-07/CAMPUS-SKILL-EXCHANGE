import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId'); // Support initiating chat from browse page

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // Load current user and conversations on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUserId(JSON.parse(storedUser).id);
      } catch {}
    }
    initConversations();

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Poll active conversation messages
  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    if (activeConv) {
      fetchMessages(activeConv.id, false);
      pollingRef.current = setInterval(() => {
        fetchMessages(activeConv.id, true);
      }, 5000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeConv]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initConversations = async () => {
    setLoadingConv(true);
    setError('');
    try {
      const res = await api.get('/messages/conversations');
      const convs = res.data || [];
      setConversations(convs);

      // If user came with a specific userId from elsewhere, try to open/create conversation
      if (targetUserId) {
        const found = convs.find(c => c.user1Id === targetUserId || c.user2Id === targetUserId);
        if (found) {
          setActiveConv(found);
        } else {
          // Create new conversation
          const createRes = await api.post('/messages/conversations', { userId: targetUserId });
          if (createRes.data) {
            // Reload list and set active
            const reloadRes = await api.get('/messages/conversations');
            setConversations(reloadRes.data || []);
            const newConv = (reloadRes.data || []).find(c => c.id === createRes.data.id);
            if (newConv) setActiveConv(newConv);
          }
        }
      } else if (convs.length > 0) {
        setActiveConv(convs[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load conversations.');
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessages = async (convId, isPoll = false) => {
    if (!isPoll) setLoadingMsg(true);
    try {
      const res = await api.get(`/messages/conversations/${convId}/messages`);
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!isPoll) setLoadingMsg(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const res = await api.post(`/messages/conversations/${activeConv.id}/messages`, { content });
      setMessages(prev => [...prev, res.data]);
      
      // Update last message preview in conversations list
      setConversations(prev => prev.map(c => {
        if (c.id === activeConv.id) {
          return { ...c, messages: [res.data], updatedAt: new Date().toISOString() };
        }
        return c;
      }));
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const getPartnerUser = (conv) => {
    if (!conv) return null;
    return conv.user1Id === currentUserId ? conv.user2 : conv.user1;
  };

  const initials = (name) => name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', height: 'calc(100vh - 10rem)', minHeight: '500px' }}>
      {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

      <div className="card flex" style={{ height: '100%', padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
        
        {/* Left conversations list */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }} className="hide-mobile">
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-hover)' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Chat Inbox</h3>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loadingConv ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <span className="spinner" style={{ width: 24, height: 24 }} />
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active conversations yet.
              </div>
            ) : (
              conversations.map(c => {
                const partner = getPartnerUser(c);
                const isActive = activeConv?.id === c.id;
                const lastMsg = c.messages?.[0]?.content || 'Start a conversation...';
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConv(c)}
                    style={{
                      padding: '1.25rem',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="avatar avatar-sm">{initials(partner?.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isActive ? 'var(--primary)' : 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {partner?.name || 'Peer Expert'}
                      </div>
                      <p className="text-muted" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.15rem' }}>
                        {lastMsg}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right chat logs pane */}
        {activeConv ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
            
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface-hover)' }}>
              <div className="avatar avatar-sm">{initials(getPartnerUser(activeConv)?.name)}</div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{getPartnerUser(activeConv)?.name}</h3>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Active Session Partner</span>
              </div>
            </div>

            {/* Message Thread */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loadingMsg ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <span className="spinner" style={{ width: 32, height: 32 }} />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👋</div>
                  <p>Send a message to introduce yourself and set up a swap time!</p>
                </div>
              ) : (
                messages.map(m => {
                  const isMe = m.senderId === currentUserId;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        backgroundColor: isMe ? 'var(--primary)' : 'var(--border)',
                        color: isMe ? 'white' : 'var(--text-main)',
                        padding: '0.75rem 1rem',
                        borderRadius: isMe ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                        maxWidth: '70%',
                        wordBreak: 'break-word',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{m.content}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.75, textAlign: 'right', marginTop: '0.35rem' }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', background: 'var(--bg-surface-hover)' }}>
              <input
                type="text"
                className="input"
                placeholder="Write your message here..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{ flex: 1 }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                Send
              </button>
            </form>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📥</div>
            <h2>Inbox is Empty</h2>
            <p style={{ marginTop: '0.5rem', maxWidth: '300px', textAlign: 'center' }}>
              Select a chat thread or find a peer match to start conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
