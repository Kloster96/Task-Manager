const multer = require("multer");
const path = require("path");

// Simple storage without fileFilter to avoid "Unexpected field" errors
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer: destination, file:", file.fieldname);
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log("Multer: filename, file:", file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Just use diskStorage with no fileFilter - accept everything
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;