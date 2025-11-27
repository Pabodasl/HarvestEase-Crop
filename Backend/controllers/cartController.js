const Cart = require('../models/cartModel');
const Stock = require('../models/stockModel');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const stock = await Stock.findById(productId);

    if (!stock) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalPrice = stock.price * quantity;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice =
        cart.items[existingItemIndex].quantity * stock.price;
    } else {
      // Add new item to cart
      cart.items.push({ productId, quantity, price: stock.price, totalPrice });
    }

    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
  }
};

// Update quantity in cart
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const stock = await Stock.findById(productId);

    if (!stock) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].totalPrice = quantity * stock.price;
      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Failed to update quantity', error: error.message });
  }
};
