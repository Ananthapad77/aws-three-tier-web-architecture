import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, deleteUser } from '../services/api';
import UserModal from '../components/UserModal';

export default function UsersPage() {
  const [data, setData]         = useState({ data: [], pagination: {} });
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filters, setFilters]   = useState({ search: '', role: '', status: '', page: 1, limit: 10 });
  const [modal, setModal]       = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    getUsers(filters)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteUser(id);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  const { data: users = [], pagination = {} } = data;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            {pagination.total != null ? `${pagination.total} users` : 'Loading…'} stored in RDS MySQL
          </p>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: 6 }}
          onClick={() => setModal({ open: true, user: null })}
        >
          + Add User
        </button>
      </div>

      <div className="page-body">
        {error && <div className="error-toast">⚠ {error}</div>}

        <div className="card">
          {/* ── Filters ──────────────────────────────── */}
          <div className="card-header">
            <div className="filters-row">
              <input
                className="search-input"
                placeholder="Search name or email…"
                value={filters.search}
                onChange={(e) => handleFilter('search', e.target.value)}
              />
              <select
                className="select-input"
                value={filters.role}
                onChange={(e) => handleFilter('role', e.target.value)}
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <select
                className="select-input"
                value={filters.status}
                onChange={(e) => handleFilter('status', e.target.value)}
              >
                <option value="">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load}>↻ Refresh</button>
          </div>

          {/* ── Table ────────────────────────────────── */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5}><div className="loading-state">Loading users from RDS…</div></td></tr>
                )}
                {!loading && users.length === 0 && (
                  <tr><td colSpan={5}><div className="empty-state">No users found. Click "Add User" to create one.</div></td></tr>
                )}
                {!loading && users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar">{getInitials(user.name)}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${user.status}`}>{user.status}</span>
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
                      {formatDate(user.created_at)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setModal({ open: true, user })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={deleting === user.id}
                          onClick={() => handleDelete(user.id)}
                        >
                          {deleting === user.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ───────────────────────────── */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <span>
                Page {pagination.page} of {pagination.totalPages} — {pagination.total} total
              </span>
              <div className="pagination-btns">
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                >
                  ← Prev
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────── */}
      {modal.open && (
        <UserModal
          user={modal.user}
          onClose={() => setModal({ open: false, user: null })}
          onSaved={() => { setModal({ open: false, user: null }); load(); }}
        />
      )}
    </div>
  );
}

function getInitials(name = '') {
  return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
