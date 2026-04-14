const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getTemplates, createTemplate, deleteTemplate } = require('../controllers/templateController');

const router = express.Router();

router.get('/', protect, getTemplates);
router.post('/', protect, adminOnly, createTemplate);
router.delete('/:id', protect, adminOnly, deleteTemplate);

module.exports = router;