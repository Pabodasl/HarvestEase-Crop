const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Store the price at the time of addition
  totalPrice: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Cart', cartSchema);
