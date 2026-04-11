require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();

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

// Add multipart parser BEFORE routes but AFTER static
// This ensures multer can handle multipart before it hits the routes
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`localhost:${PORT}`);
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