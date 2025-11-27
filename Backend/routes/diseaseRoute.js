// routes/diseaseRoute.js
const express = require('express');
const { addDisease, getDiseases, updateDisease, deleteDisease, searchDisease, upload, uploadImage } = require('../controllers/diseaseController');
const router = express.Router();

// Image upload route for disease detection
router.post('/upload', upload.single('image'), uploadImage);

// Admin routes for managing diseases
router.post('/add', upload.single('image'), addDisease);
router.get('/', getDiseases);
router.put('/:id', upload.single('image'), updateDisease);
router.delete('/:id', deleteDisease);

// Farmer route to search diseases
router.post('/search', searchDisease);

module.exports = router;
