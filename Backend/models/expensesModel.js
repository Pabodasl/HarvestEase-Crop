const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  crop: {
    type: String,
    trim: true
  },
  user: {
    type: String,
    required: [true, 'User is required'],
  },
  date: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (date) {
        return date <= new Date();
      },
      message: 'Invalid date',
    },
  }
}, {
  timestamps: true
});

expensesSchema.index({ category: 1, date: -1 });
expensesSchema.index({ crop: 1 });

module.exports = mongoose.model('Expense', expensesSchema);

