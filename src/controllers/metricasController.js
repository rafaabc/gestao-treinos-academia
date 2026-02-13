const metricasService = require('../services/metricasService');

exports.getMetricas = (req, res) => {
  try {
    const metricas = metricasService.getMetricas(req.user.username);
    res.json(metricas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.setMeta = (req, res) => {
  try {
    const { meta } = req.body;
    metricasService.setMeta(req.user.username, meta);
    res.status(200).json({ message: 'Meta definida' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
