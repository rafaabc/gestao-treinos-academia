const jwt = require('jsonwebtoken');
const SECRET = 'supersecretkey';

module.exports = function (req, res, next) {
  if (req.path.startsWith('/api/users') || req.path.startsWith('/api/login') || req.path.startsWith('/api-docs')) {
    return next();
  }
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
