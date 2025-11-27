const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Route to add new stock
router.post('/add-stock', stockController.addStock);

// Route to get all stocks
router.get('/get-stocks', stockController.getStocks);

// Route to update a stock by ID (PUT)
router.put('/update-stock/:id', stockController.updateStock);

// Route to delete a stock by ID (DELETE)
router.delete('/delete-stock/:id', stockController.deleteStock);


module.exports = router;
