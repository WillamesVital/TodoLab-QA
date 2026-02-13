const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente ou inválido' });
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({ error: 'Token ausente ou inválido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Token ausente ou inválido' });
  }
}

module.exports = auth;
