// All requests go to /api — the "proxy" field in package.json
// forwards them to localhost:8080 in dev.
// In production, CloudFront routes /api/* to the ALB.

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Users ────────────────────────────────────────────────────
export const getUsers = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  return request(`/users${qs ? `?${qs}` : ''}`);
};

export const getUserById = (id) => request(`/users/${id}`);

export const createUser = (data) =>
  request('/users', { method: 'POST', body: JSON.stringify(data) });

export const updateUser = (id, data) =>
  request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteUser = (id) =>
  request(`/users/${id}`, { method: 'DELETE' });

export const getUserStats = () => request('/users/stats');
