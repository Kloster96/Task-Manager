const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, taskId, description, details = {}) => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            task: taskId,
            description,
            details
        });
    } catch (error) {
        console.error('Error logging activity:', error.message);
    }
};

// Middleware para logging automático
const activityLogger = (action) => {
    return async (req, res, next) => {
        // Guardar la respuesta original
        const originalSend = res.send;
        
        res.send = function(data) {
            // Solo loguear si la operación fue exitosa (status 2xx)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                const taskId = req.params.id || req.body?._id;
                const description = getActivityDescription(action, req);
                
                // Async logueo sin bloquear la respuesta
                logActivity(
                    req.user._id,
                    action,
                    taskId,
                    description,
                    req.body
                ).catch(err => console.error('Activity log error:', err));
            }
            
            return originalSend.call(this, data);
        };
        
        next();
    };
};

const getActivityDescription = (action, req) => {
    switch (action) {
        case 'created':
            return `Creó la tarea: ${req.body.title || 'Tarea sin título'}`;
        case 'updated':
            return `Actualizó la tarea: ${req.body.title || ''}`;
        case 'deleted':
            return `Eliminó una tarea`;
        case 'completed':
            return `Completó la tarea`;
        case 'assigned':
            return `Asignó usuarios a la tarea`;
        default:
            return `Realizó una acción en tarea`;
    }
};

const getActivityLogs = async (req, res) => {
    try {
        const { taskId, userId, limit = 50, page = 1 } = req.query;
        
        let filter = {};
        
        if (taskId) {
            filter.task = taskId;
        }
        if (userId) {
            filter.user = userId;
        }
        
        const skip = (page - 1) * limit;
        
        const logs = await ActivityLog.find(filter)
            .populate('user', 'name email profileImageUrl')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await ActivityLog.countDocuments(filter);
        
        res.json({
            logs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
    }
};

module.exports = {
    logActivity,
    activityLogger,
    getActivityLogs
};