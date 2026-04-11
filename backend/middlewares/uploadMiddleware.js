const multer = require("multer");
const path = require("path");

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer: destination called, file:", file);
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log("Multer: filename called, file:", file);
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Filtro opcional de archivos
const fileFilter = (req, file, cb) => {
  console.log("Multer: fileFilter called, file:", file);
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPEG y PNG"));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;