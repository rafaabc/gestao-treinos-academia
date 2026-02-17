const metricsService = require('../services/metricsService');

exports.getMetrics = (req, res) => {
  try {
    const metrics = metricsService.getMetrics(req.user.username);
    res.json(metrics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.setGoal = (req, res) => {
  try {
    const { goal } = req.body;
    metricsService.setGoal(req.user.username, goal);
    res.status(200).json({ message: 'Annual goal set' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
