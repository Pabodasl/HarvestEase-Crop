const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  cropType: { 
    type: String, 
    required: [true, 'Crop type is required'],
    trim: true
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0']
  },
  buyerDetails: {
    name: { 
      type: String, 
      required: [true, 'Buyer name is required'],
      trim: true
    },
    contact: { 
      type: String,
      trim: true
    },
  },
  user: { 
    type: String, 
    required: [true, 'User is required'],
  },
  date: { 
    type: Date, 
    default: Date.now,
    
    validate: {
      validator: function(date) {
        
        return date <= new Date() || date > new Date();
      },
      message: 'Invalid date'
    }
  }
}, {
  timestamps: true
});

salesSchema.index({ cropType: 1, date: -1 });

const Sales = mongoose.model('Sale', salesSchema);
module.exports = Sales;
