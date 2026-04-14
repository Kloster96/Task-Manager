const Notification = require('../models/Notification');

// Crear una notificación
const createNotification = async (userId, type, title, message, taskId = null, fromUserId = null) => {
    try {
        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            task: taskId,
            from: fromUserId
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error.message);
        return null;
    }
};

// Obtener notificaciones del usuario
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 20, page = 1, unreadOnly = false } = req.query;
        
        const filter = { user: userId };
        if (unreadOnly === 'true') {
            filter.read = false;
        }
        
        const skip = (page - 1) * limit;
        
        const notifications = await Notification.find(filter)
            .populate('from', 'name profileImageUrl')
            .populate('task', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({ user: userId, read: false });
        
        res.json({
            notifications,
            unreadCount,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// Marcar notificación como leída
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: req.user._id },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
};

// Marcar todas las notificaciones como leídas
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { read: true }
        );
        
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
    }
};

// Eliminar notificación
const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            user: req.user._id
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error: error.message });
    }
};

// Notificar cuando se asigna una tarea
const notifyTaskAssigned = async (task, assignedUserIds, fromUserId) => {
    const notifications = assignedUserIds.map(userId => 
        createNotification(
            userId,
            'task_assigned',
            'Nueva tarea asignada',
            `Se te ha asignado la tarea: ${task.title}`,
            task._id,
            fromUserId
        )
    );
    await Promise.all(notifications);
};

// Notificar cuando se completa una tarea
const notifyTaskCompleted = async (task, fromUserId) => {
    // Notificar al creador de la tarea
    if (task.createdBy && task.createdBy.toString() !== fromUserId.toString()) {
        await createNotification(
            task.createdBy,
            'task_completed',
            'Tarea completada',
            `La tarea "${task.title}" ha sido completada`,
            task._id,
            fromUserId
        );
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    notifyTaskAssigned,
    notifyTaskCompleted
};