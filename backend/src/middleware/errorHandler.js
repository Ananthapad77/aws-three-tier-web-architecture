// Global error handler — catches any error passed to next(err)
module.exports = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  const message    = process.env.NODE_ENV === 'production'
    ? (statusCode < 500 ? err.message : 'Internal server error')
    : err.message;

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
