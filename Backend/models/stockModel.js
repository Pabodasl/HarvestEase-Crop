const mongoose = require('mongoose');

// Define the stock schema
const stockSchema = new mongoose.Schema({
  farmerId: { type: String, required: true },
  farmerName: { type: String, required: true },
  farmerEmail: { type: String, required: true },
  cropType: { type: String, enum: ['paddy', 'rice'], required: true },
  variety: { type: String, required: true },
  quantity: { type: Number, required: true },
  quantityUnit: { type: String, enum: ['kg', 'MT'], default: 'kg' },
  price: { type: Number, required: true },
  stockDate: { type: Date, default: Date.now },
  moistureLevel: { type: Number, required: false }, // Optional for paddy
  harvestedDate: { type: Date, required: false },
  storageTemperature: { type: Number, required: false },
  storageHumidity: { type: Number, required: false },
  processingType: { 
    type: String, 
    enum: ['raw', 'parboiled', 'polished'], 
    default: null, 
    required: function() { return this.cropType === 'rice'; }
  },
  packagingType: { 
    type: String, 
    enum: ['sack', 'box', 'loose'], 
    default: null,
    required: function() { return this.cropType === 'rice'; }
  },
  
  bestBeforeDate: { type: Date, required: false },
  storageLocation: { type: String, required: true },
  qualityGrade: { type: String, enum: ['A', 'B', 'C', 'premium', 'standard', 'low'], required: true },
  status: { type: String, enum: ['Available', 'Sold Out', 'Pending'], default: 'Available' },
  description: { type: String, required: false }
});

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
