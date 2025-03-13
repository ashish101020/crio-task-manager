const multer = require("multer");

// Use memory storage (store file in RAM before saving to MongoDB)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed!"), false);
    }
  },
});

module.exports = upload;
