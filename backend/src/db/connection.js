const mysql = require('mysql2/promise');

let pool;

/**
 * Connects to MySQL / RDS and creates a connection pool.
 * Environment variables (set these in .env locally, in Beanstalk env vars on AWS):
 *   DB_HOST     – RDS endpoint or localhost
 *   DB_USER     – database username
 *   DB_PASSWORD – database password
 *   DB_NAME     – database name
 *   DB_PORT     – default 3306
 */
async function connectDB() {
  pool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || 'password',
    database:           process.env.DB_NAME     || 'appdb',
    port:               parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    connectTimeout:     10000,
    // Enable SSL when connecting to RDS in production
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : undefined,
  });

  // Test the connection
  const conn = await pool.getConnection();
  console.log(`✅ MySQL connected to ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'appdb'}`);
  conn.release();

  // Run schema migration on startup
  await runMigrations();
}

/**
 * Auto-creates the tables if they don't exist.
 * Safe to run multiple times (idempotent).
 */
async function runMigrations() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id         INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(255) NOT NULL UNIQUE,
      role       ENUM('admin','editor','viewer') NOT NULL DEFAULT 'viewer',
      status     ENUM('active','inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email  (email),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  ];

  for (const q of queries) {
    await pool.execute(q);
  }
  console.log('✅ Database schema ready');
}

const getPool = () => {
  if (!pool) throw new Error('Database not initialized. Call connectDB() first.');
  return pool;
};

module.exports = { connectDB, getPool };
