import React from 'react';

export default function Community() {
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1>Clubs & Communities</h1>
        <button className="btn btn-primary">+ Create Club</button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8" style={{ marginBottom: '3rem' }}>
        {[
          { name: 'Web Dev Wizards', members: 120, icon: '🌐' },
          { name: 'Language Exchange', members: 340, icon: '🗣️' },
          { name: 'Design Thinkers', members: 85, icon: '🎨' },
        ].map((club, i) => (
          <div key={i} className="card text-center" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{club.icon}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{club.name}</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{club.members} Members</p>
            <button className="btn btn-outline" style={{ width: '100%' }}>Join Group</button>
          </div>
        ))}
      </div>
      
      <h2>Recent Discussions</h2>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ padding: '1.5rem', borderBottom: i !== 3 ? '1px solid var(--border)' : 'none' }}>
            <div className="flex gap-4">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border)' }}></div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>How to center a div in 2026?</h4>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Posted in Web Dev Wizards by Jane Doe</p>
                <div className="flex gap-4 text-muted" style={{ fontSize: '0.875rem' }}>
                  <span>💬 12 comments</span>
                  <span>👍 45 upvotes</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
