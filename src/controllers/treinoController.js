const treinoService = require('../services/treinoService');

exports.getCalendario = (req, res) => {
  try {
    const calendario = treinoService.getCalendario(req.user.username, req.query.mes, req.query.ano);
    res.json(calendario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.marcarTreino = (req, res) => {
  try {
    const { dia, mes, ano } = req.body;
    treinoService.marcarTreino(req.user.username, dia, mes, ano);
    res.status(201).json({ message: 'Treino marcado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.desmarcarTreino = (req, res) => {
  try {
    const { dia, mes, ano } = req.body;
    treinoService.desmarcarTreino(req.user.username, dia, mes, ano);
    res.status(200).json({ message: 'Treino desmarcado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
