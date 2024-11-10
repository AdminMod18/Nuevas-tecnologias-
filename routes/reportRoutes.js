// routes/statistics.js
const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/reportController');
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Endpoint para obtener estadísticas
router.get('/statistics', authMiddleware, authorize(['doctor', 'admin']),statisticsController.getStatistics);

module.exports = router;
