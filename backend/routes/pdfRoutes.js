const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/authMiddleware');
const { exportTasksToPDF } = require('../controllers/pdfController');

const router = express.Router();

// Exportar tareas a PDF (solo admin)
router.get('/export-tasks-pdf', protect, adminOnly, exportTasksToPDF);

module.exports = router;