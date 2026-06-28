import React from 'react';

export default function Wallet() {
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Points Wallet</h1>
      
      <div className="card text-center" style={{ padding: '3rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '500', opacity: 0.9 }}>Current Balance</h2>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '1rem 0' }}>1,250</div>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>Skill Tokens</p>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>Transaction History</h3>
        
        {[
          { type: 'earn', title: 'Taught React.js (1hr)', amount: '+50', date: 'Oct 24, 2026' },
          { type: 'spend', title: 'Learned UI Design (1hr)', amount: '-50', date: 'Oct 20, 2026' },
          { type: 'earn', title: 'Platform Onboarding Bonus', amount: '+100', date: 'Oct 15, 2026' },
        ].map((tx, i) => (
          <div key={i} className="flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: i !== 2 ? '1px solid var(--border)' : 'none' }}>
            <div>
              <h4 style={{ fontSize: '1rem' }}>{tx.title}</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>{tx.date}</p>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: tx.type === 'earn' ? 'var(--secondary)' : 'var(--accent)' }}>
              {tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
