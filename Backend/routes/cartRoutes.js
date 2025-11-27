const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add to cart
router.post('/add-to-cart', cartController.addToCart);

// Get cart
router.get('/:userId', cartController.getCart);

// Remove from cart
router.delete('/remove-from-cart', cartController.removeFromCart);

// Update quantity
router.put('/update-quantity', cartController.updateQuantity);

module.exports = router;
