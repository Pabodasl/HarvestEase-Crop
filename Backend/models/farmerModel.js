const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farmer name is required'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalExpenses: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

farmerSchema.virtual('profit').get(function() {
  return this.totalSales - this.totalExpenses;
});

farmerSchema.virtual('roi').get(function() {
  return this.totalExpenses > 0 ? (this.profit / this.totalExpenses * 100) : 0;
});

farmerSchema.index({ name: 1 });
farmerSchema.index({ region: 1 });
farmerSchema.index({ status: 1 });

module.exports = mongoose.model('Farmer', farmerSchema);