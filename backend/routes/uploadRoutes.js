const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { protect, isSuperAdminOrRestaurantAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Store files temporarily
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.post(
  '/',
  protect,
  isSuperAdminOrRestaurantAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'food-delivery',
      });

      // Delete temp file
      fs.unlinkSync(req.file.path);

      res.json({ imageUrl: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Handle multer errors
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large (max 5MB)' });
  }
  res.status(400).json({ message: err.message });
});

module.exports = router;