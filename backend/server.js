require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const templateRoutes = require("./routes/templateRoutes");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

// Store connected users: { userId: socketId }
const connectedUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their user ID
    socket.on('join', (userId) => {
        connectedUsers.set(userId, socket.id);
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        // Find and remove user from connectedUsers
        for (let [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.set('io', io);

// Helper function to send real-time notification
const sendRealTimeNotification = (userId, notification) => {
    io.to(`user_${userId}`).emit('notification', notification);
};

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Connect DB
connectDB();

// Middleware 
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/templates", templateRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Global error handler for multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ message: "Error de upload: " + err.message });
    } else if (err) {
        console.error("Upload error:", err.message);
        return res.status(400).json({ message: err.message });
    }
    next();
});