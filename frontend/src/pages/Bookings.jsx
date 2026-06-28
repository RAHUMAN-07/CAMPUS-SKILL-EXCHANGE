import React from 'react';

export default function Bookings() {
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Bookings</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Upcoming Sessions</h2>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid var(--secondary)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
               <span style={{ fontWeight: '600' }}>React UI Design</span>
               <span style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Confirmed</span>
            </div>
            <p className="text-muted" style={{ marginBottom: '0.5rem' }}>📅 Tomorrow at 2:00 PM</p>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>👩‍🏫 with Sarah Smith (Online)</p>
            <div className="flex gap-4">
              <button className="btn btn-primary">Join Call</button>
              <button className="btn btn-outline">Reschedule</button>
            </div>
          </div>
        </div>
        
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Pending Requests</h2>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #F59E0B' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
               <span style={{ fontWeight: '600' }}>Intro to Python</span>
               <span style={{ color: '#F59E0B', fontSize: '0.875rem' }}>Awaiting Approval</span>
            </div>
            <p className="text-muted" style={{ marginBottom: '0.5rem' }}>📅 Friday at 4:00 PM</p>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>👨‍🎓 from Mike Johnson (Campus Library)</p>
            <div className="flex gap-4">
              <button className="btn btn-secondary">Accept</button>
              <button className="btn btn-outline">Decline</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
