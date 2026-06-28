import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import Matches from './pages/Matches';
import Bookings from './pages/Bookings';
import Messages from './pages/Messages';
import Wallet from './pages/Wallet';
import Community from './pages/Community';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import './styles/global.css';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/community" element={<Community />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
