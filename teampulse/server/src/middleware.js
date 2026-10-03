const jwt = require('jsonwebtoken');

// Runs before protected routes. Checks the token and attaches the user info to req.
function auth(req, res, next) {
  const header = req.headers.authorization || ''; // looks like: "Bearer <token>"
  const token = header.replace('Bearer ', '');
  if (!process.env.JWT_SECRET) {
    console.error('[auth] JWT_SECRET is not set in process.env - cannot verify tokens');
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role, company }
    next();
  } catch {
    res.status(401).json({ error: 'Please log in again' });
  }
}

// Only lets HR users through. Always used AFTER auth.
function hrOnly(req, res, next) {
  if (req.user.role !== 'hr') return res.status(403).json({ error: 'HR only' });
  next();
}

function errorHandler(err, req, res, next) {
  if (err.type === 'request.aborted' || err.code === 'ECONNABORTED') {
    return res.status(400).end();
  }
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
}

module.exports = { auth, hrOnly, errorHandler };
