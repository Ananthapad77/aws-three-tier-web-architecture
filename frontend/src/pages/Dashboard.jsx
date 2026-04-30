import React, { useState, useEffect } from 'react';
import { getUserStats } from '../services/api';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    getUserStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">AWS Three-Tier Architecture — User Management Demo</p>
      </div>

      <div className="page-body">
        {error && <div className="error-toast">⚠ {error}</div>}

        {/* ── Stat Cards ─────────────────────────────── */}
        <div className="stats-grid">
          <StatCard
            label="Total Users"
            value={loading ? '—' : stats?.total ?? 0}
            sub="in database"
            color="#38bdf8"
          />
          <StatCard
            label="Active"
            value={loading ? '—' : stats?.active ?? 0}
            sub="active accounts"
            color="#4ade80"
          />
          <StatCard
            label="Inactive"
            value={loading ? '—' : stats?.inactive ?? 0}
            sub="inactive accounts"
            color="#f87171"
          />
          <StatCard
            label="Admins"
            value={loading ? '—' : (stats?.byRole?.find(r => r.role === 'admin')?.count ?? 0)}
            sub="admin role"
            color="#fbbf24"
          />
        </div>

        {/* ── Architecture Info ───────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <InfoCard
            title="Presentation Tier"
            color="#38bdf8"
            items={['React 18 + React Scripts', 'Served from Amazon S3', 'Delivered via CloudFront CDN', 'HTTPS via ACM certificate', 'SPA routing via CloudFront error pages']}
          />
          <InfoCard
            title="Application Tier"
            color="#4ade80"
            items={['Node.js 18 + Express 4', 'Deployed on Elastic Beanstalk', 'Auto Scaling: 2–6 EC2 instances', 'Application Load Balancer', 'Health check at /health']}
          />
          <InfoCard
            title="Data Tier"
            color="#a78bfa"
            items={['Amazon RDS MySQL 8.0', 'Multi-AZ deployment', 'Encrypted at rest + in transit', 'ElastiCache Redis for sessions', 'Credentials via Secrets Manager']}
          />
          <InfoCard
            title="Network & Security"
            color="#fbbf24"
            items={['Custom VPC 10.0.0.0/16', 'Public + Private subnets (2 AZs)', 'Security groups per tier', 'NAT Gateway for outbound', 'AWS WAF on CloudFront']}
          />
        </div>

        {/* ── Quick Action ────────────────────────────── */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="card-title" style={{ marginBottom: 4 }}>Manage Users</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
                Create, edit, and delete users stored in RDS MySQL
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => onNavigate('users')}>
              Open Users →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function InfoCard({ title, color, items }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
        <span className="card-title">{title}</span>
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text2)', display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--text3)' }}>›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
