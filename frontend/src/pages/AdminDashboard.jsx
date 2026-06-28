import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-4 gap-6" style={{ marginBottom: '3rem' }}>
        <div className="card">
          <p className="text-muted">Total Users</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>1,245</h2>
        </div>
        <div className="card">
          <p className="text-muted">Completed Sessions</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>4,830</h2>
        </div>
        <div className="card">
          <p className="text-muted">Active Skills</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>320</h2>
        </div>
        <div className="card">
          <p className="text-muted">Pending Verifications</p>
          <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--accent)' }}>12</h2>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Users</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem 0' }}>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: '500' }}>User {i}</td>
                <td className="text-muted">user{i}@university.edu</td>
                <td>Student</td>
                <td><span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '4px', fontSize: '0.75rem' }}>Verified</span></td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
