const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
    getNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
} = require('../controllers/notificationController');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Obtener notificaciones del usuario
router.get('/', getNotifications);

// Marcar una notificación como leída
router.put('/:id/read', markAsRead);

// Marcar todas como leídas
router.put('/read-all', markAllAsRead);

// Eliminar notificación
router.delete('/:id', deleteNotification);

module.exports = router;