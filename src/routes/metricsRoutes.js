import express from 'express';
const router = express.Router();
import * as metricsController from '../controllers/metricsController.js';

router.get('/', metricsController.getMetrics);
router.post('/goal', metricsController.setGoal);

export default router;
