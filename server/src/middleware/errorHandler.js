function errorHandler(err, req, res, next) {
  console.error(`[API Error] ${req.method} ${req.url}:`, err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message, details: err.errors });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this unique value already exists.' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred.';

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
