const { getPool } = require('../db/connection');

// ── GET /api/users ────────────────────────────────────────────
exports.getAll = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let sql    = 'SELECT * FROM users WHERE 1=1';
    let params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role)   { sql += ' AND role = ?';   params.push(role);   }
    if (status) { sql += ' AND status = ?'; params.push(status); }

    // Count total for pagination
    const [countRows] = await getPool().execute(
      `SELECT COUNT(*) as total FROM users WHERE 1=1${
        search ? ' AND (name LIKE ? OR email LIKE ?)' : ''
      }${role ? ' AND role = ?' : ''}${status ? ' AND status = ?' : ''}`,
      params
    );
    const total = countRows[0].total;

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await getPool().execute(sql, params);

    res.json({
      data:       rows,
      pagination: {
        total,
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/:id ────────────────────────────────────────
exports.getById = async (req, res, next) => {
  try {
    const [rows] = await getPool().execute(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/users ───────────────────────────────────────────
exports.create = async (req, res, next) => {
  try {
    const { name, email, role = 'viewer', status = 'active' } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const [result] = await getPool().execute(
      'INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), role, status]
    );

    res.status(201).json({
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      status,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(err);
  }
};

// ── PUT /api/users/:id ────────────────────────────────────────
exports.update = async (req, res, next) => {
  try {
    const { name, email, role, status } = req.body;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const [existing] = await getPool().execute(
      'SELECT * FROM users WHERE id = ?', [req.params.id]
    );
    if (!existing.length) return res.status(404).json({ message: 'User not found' });

    const updated = {
      name:   name   ?? existing[0].name,
      email:  email  ?? existing[0].email,
      role:   role   ?? existing[0].role,
      status: status ?? existing[0].status,
    };

    await getPool().execute(
      'UPDATE users SET name=?, email=?, role=?, status=? WHERE id=?',
      [updated.name, updated.email, updated.role, updated.status, req.params.id]
    );

    res.json({ id: parseInt(req.params.id), ...updated });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(err);
  }
};

// ── DELETE /api/users/:id ─────────────────────────────────────
exports.remove = async (req, res, next) => {
  try {
    const [result] = await getPool().execute(
      'DELETE FROM users WHERE id = ?', [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/stats ──────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const [[{ total }]]  = await getPool().execute('SELECT COUNT(*) as total FROM users');
    const [[{ active }]] = await getPool().execute("SELECT COUNT(*) as active FROM users WHERE status='active'");
    const [roles]        = await getPool().execute('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    res.json({ total, active, inactive: total - active, byRole: roles });
  } catch (err) {
    next(err);
  }
};
