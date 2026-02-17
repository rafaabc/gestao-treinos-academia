const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.get('/calendar', workoutController.getCalendar);
router.post('/calendar', workoutController.setWorkout);
router.delete('/calendar', workoutController.unsetWorkout);

module.exports = router;
