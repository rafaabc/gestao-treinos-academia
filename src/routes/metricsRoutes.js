const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

router.get('/', metricsController.getMetrics);
router.post('/goal', metricsController.setGoal);

module.exports = router;
