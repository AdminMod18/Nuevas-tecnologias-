const express = require('express');
const { generateReport } = require('../controllers/pdfController');
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

router.get('/generate-pdf',authMiddleware, authorize(['doctor', 'admin']), generateReport);

module.exports = router;
