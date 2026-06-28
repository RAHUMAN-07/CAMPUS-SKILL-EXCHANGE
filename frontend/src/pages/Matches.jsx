import React from 'react';

export default function Matches() {
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Smart Match Suggestions</h1>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Based on your "Skills I Want to Learn" and complementary interests.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {[1, 2].map(i => (
          <div key={i} className="card flex items-center gap-6" style={{ padding: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--border)' }}></div>
            <div style={{ flex: 1 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <h3>Sarah Smith</h3>
                <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>98% Match</span>
              </div>
              <p className="text-muted" style={{ marginBottom: '1rem' }}>She can teach you <strong>UI/UX Design</strong> and wants to learn <strong>React.js</strong>.</p>
              <div className="flex gap-4">
                 <button className="btn btn-primary flex-1">Connect</button>
                 <button className="btn btn-outline flex-1">View Profile</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
