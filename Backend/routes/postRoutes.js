const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/postController');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.post('/', upload.single('image'), createPost);
router.get('/', getPosts);
router.put('/:id', upload.single('image'), updatePost);
router.delete('/:id', deletePost);

module.exports = router;
