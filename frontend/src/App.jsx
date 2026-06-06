import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import UsersPage  from './pages/UsersPage';
import './App.css';

export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="app-shell">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="2" fill="#38bdf8"/>
              <rect x="11" y="2" width="7" height="7" rx="2" fill="#38bdf8" opacity="0.5"/>
              <rect x="2" y="11" width="7" height="7" rx="2" fill="#38bdf8" opacity="0.5"/>
              <rect x="11" y="11" width="7" height="7" rx="2" fill="#38bdf8"/>
            </svg>
          </div>
          <span className="logo-text">ThreeTier</span>
        </div>

        <nav className="sidebar-nav">
          <NavItem
            icon={<IconDashboard />}
            label="Dashboard"
            active={page === 'dashboard'}
            onClick={() => setPage('dashboard')}
          />
          <NavItem
            icon={<IconUsers />}
            label="Users"
            active={page === 'users'}
            onClick={() => setPage('users')}
          />
        </nav>

        <div className="sidebar-footer">
          <div className="arch-badge">
            <span className="arch-dot" style={{ background: '#38bdf8' }} />
            <span>CloudFront</span>
          </div>
          <div className="arch-badge">
            <span className="arch-dot" style={{ background: '#4ade80' }} />
            <span>Beanstalk</span>
          </div>
          <div className="arch-badge">
            <span className="arch-dot" style={{ background: '#a78bfa' }} />
            <span>RDS MySQL</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <main className="main-content">
        {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
        {page === 'users'     && <UsersPage />}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Icons
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
