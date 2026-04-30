import React, { useState } from 'react';
import { createUser, updateUser } from '../services/api';

export default function UserModal({ user, onClose, onSaved }) {
  const isEdit = Boolean(user);

  const [form, setForm]     = useState({
    name:   user?.name   || '',
    email:  user?.email  || '',
    role:   user?.role   || 'viewer',
    status: user?.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name  = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setApiError('');
    try {
      if (isEdit) {
        await updateUser(user.id, form);
      } else {
        await createUser(form);
      }
      onSaved();
    } catch (e) {
      setApiError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">{isEdit ? 'Edit User' : 'Add New User'}</h2>

        {apiError && <div className="error-toast" style={{ marginBottom: 16 }}>⚠ {apiError}</div>}

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            placeholder="e.g. Ananthapadmanabhan"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="e.g. user@example.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={(e) => set('role', e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
