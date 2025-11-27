const Disease = require('../models/diseaseModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Handle image upload for disease detection
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Create the image URL
        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: err.message });
    }
};

// External API request function
const fetchExternalDiseases = async (affectedParts, symptoms) => {
    try {
        // Dynamically import fetch
        const { default: fetch } = await import('node-fetch');
        
        const response = await fetch(`https://crop.kindwise.com/api/v1`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer NGXBHMAex01ipHhfvocubcTZOQtf9Oi6b6FLyq1H2YcrEfPp3l`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ affectedParts, symptoms })
        });

        const apiData = await response.json();
        return apiData;
    } catch (err) {
        throw new Error('Error fetching data from external API: ' + err.message);
    }
};

// Add disease info for admin
const addDisease = async (req, res) => {
    try {
        const { diseaseName, affectedParts, symptoms, favorableConditions, treatments, nextSeasonManagement } = req.body;
        const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

        const newDisease = new Disease({
            diseaseName,
            affectedParts,
            symptoms,
            favorableConditions,
            treatments,
            nextSeasonManagement,
            imageUrl
        });

        await newDisease.save();
        res.status(201).json({ message: 'Disease information added successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all diseases for admin to manage
const getDiseases = async (req, res) => {
    try {
        const diseases = await Disease.find();
        res.status(200).json(diseases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update disease info
const updateDisease = async (req, res) => {
    try {
        const { id } = req.params;
        const { diseaseName, affectedParts, symptoms, favorableConditions, treatments, nextSeasonManagement } = req.body;
        
        // Parse JSON strings back to arrays
        const parsedAffectedParts = JSON.parse(affectedParts);
        const parsedSymptoms = JSON.parse(symptoms);
        const parsedFavorableConditions = JSON.parse(favorableConditions);
        const parsedTreatments = JSON.parse(treatments);
        const parsedNextSeasonManagement = JSON.parse(nextSeasonManagement);

        // Create update object
        const updateData = {
            diseaseName,
            affectedParts: parsedAffectedParts,
            symptoms: parsedSymptoms,
            favorableConditions: parsedFavorableConditions,
            treatments: parsedTreatments,
            nextSeasonManagement: parsedNextSeasonManagement
        };

        // If there's a new image, update the imageUrl
        if (req.file) {
            updateData.imageUrl = '/uploads/' + req.file.filename;
        }

        const updatedDisease = await Disease.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedDisease) {
            return res.status(404).json({ message: 'Disease not found' });
        }

        res.status(200).json(updatedDisease);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a disease
const deleteDisease = async (req, res) => {
    try {
        const { id } = req.params;
        await Disease.findByIdAndDelete(id);
        res.status(200).json({ message: 'Disease deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Search for diseases based on farmer's query (affectedParts and symptoms)
const searchDisease = async (req, res) => {
    try {
        const { affectedParts, symptoms } = req.body;

        // Perform case-insensitive matching using regex
        const diseases = await Disease.find({
            affectedParts: { $regex: affectedParts, $options: 'i' },
            symptoms: { $regex: symptoms, $options: 'i' }
        });

        // If matches are found in the database, return them
        if (diseases.length > 0) {
            return res.status(200).json(diseases);
        }

        // If no matches, fetch from external API
        const apiData = await fetchExternalDiseases(affectedParts, symptoms);
        res.status(200).json(apiData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addDisease,
    getDiseases,
    updateDisease,
    deleteDisease,
    searchDisease,
    upload,
    uploadImage
};
