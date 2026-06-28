import React from 'react';

export default function Messages() {
  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', height: 'calc(100vh - 10rem)' }}>
      <div className="card flex" style={{ height: '100%', padding: 0, overflow: 'hidden' }}>
        
        {/* Chat List */}
        <div style={{ width: '300px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <h3>Conversations</h3>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', backgroundColor: i === 1 ? 'var(--bg-surface-hover)' : 'transparent' }} className="flex items-center gap-4">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)' }}></div>
                <div>
                  <h4 style={{ fontSize: '0.875rem' }}>User {i}</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '180px' }}>
                    Hey, are we still on for tomorrow?
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)' }}></div>
            <h3>User 1</h3>
          </div>
          
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 1rem 0', maxWidth: '70%' }}>
               Hi! I have a question about the React syllabus.
             </div>
             <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 0 1rem', maxWidth: '70%' }}>
               Sure, what do you want to know?
             </div>
          </div>
          
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
            <input type="text" className="input" placeholder="Type a message..." style={{ flex: 1 }} />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
