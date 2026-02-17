const workoutService = require('../services/workoutService');

exports.getCalendar = (req, res) => {
  try {
    const calendar = workoutService.getCalendar(req.user.username, req.query.month, req.query.year);
    res.json(calendar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.setWorkout = (req, res) => {
  try {
    const { day, month, year } = req.body;
    workoutService.setWorkout(req.user.username, day, month, year);
    res.status(201).json({ message: 'Workout set' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.unsetWorkout = (req, res) => {
  try {
    const { day, month, year } = req.body;
    workoutService.unsetWorkout(req.user.username, day, month, year);
    res.status(200).json({ message: 'Workout unset' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
