const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["task_assigned", "task_completed", "task_updated", "task_deleted", "comment", "reminder"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Índice para consultas frecuentes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);