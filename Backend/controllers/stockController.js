const Stock = require('../models/stockModel');

// Controller to add a new stock
exports.addStock = async (req, res) => {
  try {
    // Log the incoming request body to make sure the data is as expected
    console.log('Received data for adding stock:', req.body);

    // Create a new stock document based on the incoming data
    const newStock = new Stock(req.body);

    // Save the new stock to the database
    await newStock.save();

    // Send the newly added stock as a response
    res.status(200).json(newStock);
  } catch (error) {
    // Log the error for debugging
    console.error('Error adding stock:', error.message);

    // Send an error response to the client
    res.status(500).json({
      message: 'Failed to add stock',
      error: error.message,
    });
  }
};

// Controller to fetch all stocks from the database
exports.getStocks = async (req, res) => {
  try {
    // Fetch all stock records from the database
    const stocks = await Stock.find();

    // Send the list of stocks as the response
    res.status(200).json(stocks);
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching stocks:', error.message);

    // Send an error response to the client
    res.status(500).json({
      message: 'Failed to fetch stocks',
      error: error.message,
    });
  }
};

// In your stockController.js
// Controller to update a stock by its ID
exports.updateStock = async (req, res) => {
  const { id } = req.params; // Get the stock ID from the URL
  const updatedStockData = req.body; // Get the updated stock data from the request body

  try {
    const updatedStock = await Stock.findByIdAndUpdate(id, updatedStockData, { new: true });
    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json(updatedStock); // Send the updated stock as a response
  } catch (error) {
    console.error('Error updating stock:', error.message);
    res.status(500).json({
      message: 'Failed to update stock',
      error: error.message,
    });
  }
};

// In your stockController.js
// Controller to delete stock
exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByIdAndDelete(id); // Delete the stock by its ID

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error.message);
    res.status(500).json({ message: 'Failed to delete stock', error: error.message });
  }
};

