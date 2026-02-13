const userService = require('../services/userService');

exports.register = (req, res) => {
  const { username, password } = req.body;
  try {
    const user = userService.register(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  try {
    const token = userService.login(username, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  // Stateless JWT: logout is client-side (just discard token)
  res.status(200).json({ message: 'Logout realizado com sucesso' });
};
