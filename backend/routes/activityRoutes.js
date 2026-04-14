const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getActivityLogs } = require('../middlewares/activityLogger');

const router = express.Router();

// Obtener historial de actividad
router.get('/', protect, getActivityLogs);

module.exports = router;