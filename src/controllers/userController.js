import * as userService from '../services/userService.js';

export function register(req, res) {
  const { username, password } = req.body;
  try {
    const user = userService.register(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export function login(req, res) {
  const { username, password } = req.body;
  try {
    const token = userService.login(username, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export function logout(req, res) {
  res.status(200).json({ message: 'Success Logout' });
}
