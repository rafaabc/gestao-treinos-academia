import express from 'express';
const router = express.Router();
import * as workoutController from '../controllers/workoutController.js';

router.post('/calendar', workoutController.setWorkout);
router.delete('/calendar', workoutController.unsetWorkout);
router.get('/calendar', workoutController.getCalendar);

export default router;
