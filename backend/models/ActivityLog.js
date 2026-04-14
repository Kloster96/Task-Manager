const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        enum: ["created", "updated", "deleted", "completed", "assigned", "commented"],
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed // Para guardar cambios específicos
    }
}, {
    timestamps: true
});

// Índices para consultas frecuentes
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);