const jwt = require('jsonwebtoken');
const { users } = require('../models/db');
const SECRET = 'supersecretkey';

function validatePassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

exports.register = (username, password) => {
  if (!username || !password) throw new Error('Username e password obrigatórios');
  if (users[username]) throw new Error('Username já cadastrado');
  if (!validatePassword(password)) throw new Error('Password deve conter pelo menos 8 caracteres, letras e números');
  users[username] = { username, password, meta: 200 };
  return { username };
};

exports.login = (username, password) => {
  const user = users[username];
  if (!user || user.password !== password) throw new Error('Credenciais inválidas');
  return jwt.sign({ username }, SECRET, { expiresIn: '12h' });
};
