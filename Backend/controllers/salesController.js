const Sales = require('../models/salesModel'); // Use require, not import

const getSalesByUserId = async (req, res) => {
  const userId = req.params.user; // Get the user ID from the request parameters
  try {
    const sales = await Sales.find({ user: userId }); // Call the function to find sales by user ID
    res.status(200).json(sales); // Return the sales data
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
}

// Create a new sale
const createSale = async (req, res) => {
  try {
    console.log("Request body:", req.body);  // Log the request body to see if the data is being passed correctly
    const sale = new Sales(req.body); // Create a new instance of the Sales model
    await sale.save(); // Save the new sale to the database
    const allSales = await Sales.find().sort({ date: -1 }); // Return the updated list of sales
    res.status(201).json(allSales); // Send back the updated sales list
  } catch (error) {
    console.error("Error in createSale:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update an existing sale
const updateSale = async (req, res) => {
  try {
    const updatedSale = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a sale
const deleteSale = async (req, res) => {
  try {
    await Sales.findByIdAndDelete(req.params.id);
    const allSales = await Sales.find().sort({ date: -1 }); // Get the updated list of sales
    res.status(200).json(allSales); // Return the updated sales list
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminSales = async (req, res) => {
  try {
    const sales = await Sales.find().sort({ date: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSalesByUserId, createSale, updateSale, deleteSale, getAdminSales }; // Export the controller functions
