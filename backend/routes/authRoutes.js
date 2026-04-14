const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-image", upload.any(), (req, res) => {
    console.log("Upload endpoint called, files:", req.files);
    console.log("Body:", req.body);
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const file = req.files[0];
    // file.path contiene la URL pública de Cloudinary
    const imageUrl = file.path;
    res.status(200).json({ imageUrl });
});

module.exports = router;