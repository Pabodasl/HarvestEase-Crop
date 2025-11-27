const express = require('express');
const router = express.Router();

const {
  getSales,
  createSale,
  updateSale,
  deleteSale,
  getSalesSummary
} = require('../controllers/adminSalesController');

const {
  getExpensesByUser,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesSummary,
  getAllExpenses
} = require('../controllers/expensesController');

const {
  updateFarmer,
  deleteFarmer,
  getFarmerStats,
  getAllFarmers
} = require('../controllers/adminFarmersController');

const {
  getSystemProfits,
  getCropWiseProfits,
  getRegionalProfits
} = require('../controllers/adminProfitsController');
const { getById } = require('../controllers/authController');

// Sales routes
router.get('/sales', getSales);
router.post('/sales', createSale);
router.put('/sales/:id', updateSale);
router.delete('/sales/:id', deleteSale);
router.get('/sales/summary', getSalesSummary);

// Expenses routes
router.get('/expenses/:user', getExpensesByUser);
router.get('/expenses', getAllExpenses);
router.post('/expenses', createExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);
router.get('/expenses/summary', getExpensesSummary);

// Farmers routes
router.get('/farmers', getAllFarmers);
router.put('/farmers/:id', updateFarmer);
router.delete('/farmers/:id', deleteFarmer);
router.get('/farmers/:farmerId/stats', getFarmerStats);


// Profits routes
router.get('/profits/system', getSystemProfits);
router.get('/profits/crops', getCropWiseProfits);
router.get('/profits/regions', getRegionalProfits);

// User routes
router.get('/users/:id', getById);

module.exports = router;