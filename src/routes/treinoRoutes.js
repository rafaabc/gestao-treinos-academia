const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');

router.get('/calendario', treinoController.getCalendario);
router.post('/calendario', treinoController.marcarTreino);
router.delete('/calendario', treinoController.desmarcarTreino);

module.exports = router;
