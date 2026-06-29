import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Wallet() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/wallet');
      setWallet(res.data || { balance: 0, transactions: [] });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch wallet information.');
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
        <p className="text-muted">Loading your wallet stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container animate-fade-in" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>⚠️ {error}</div>
        <button onClick={fetchWalletInfo} className="btn btn-outline">Retry</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Points Wallet</h1>
      
      {/* Balance Card */}
      <div className="card text-center" style={{
        padding: '3rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '500', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Balance</h2>
        <div style={{ fontSize: '4.5rem', fontWeight: 900, margin: '1rem 0', letterSpacing: '-0.02em' }}>
          {wallet.balance}
        </div>
        <p style={{ fontSize: '1.1rem', opacity: 0.95, fontWeight: 600 }}>Skill Swap Tokens 🎓</p>
      </div>
      
      {/* Transaction History */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', fontSize: '1.2rem' }}>Transaction History</h3>
        
        {wallet.transactions.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
            <p style={{ fontWeight: 600 }}>No transactions recorded yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Complete skill swap sessions to earn points!</p>
          </div>
        ) : (
          <div>
            {wallet.transactions.map((tx, i) => (
              <div
                key={tx.id}
                className="flex justify-between items-center"
                style={{
                  padding: '1.5rem',
                  borderBottom: i !== wallet.transactions.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{tx.description || tx.type}</h4>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: tx.amount >= 0 ? 'var(--secondary)' : 'var(--accent)'
                }}>
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
