// models/diseaseModel.js
const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
    diseaseName: { type: String, required: true },
    affectedParts: { type: [String], required: true },
    symptoms: { type: [String], required: true },
    favorableConditions: { type: [String], required: true },
    treatments: { type: [String], required: true },
    nextSeasonManagement: { type: [String], required: true },
    imageUrl: { type: String }, // URL of the image uploaded
}, { timestamps: true });

const Disease = mongoose.model('Disease', diseaseSchema);

module.exports = Disease;
