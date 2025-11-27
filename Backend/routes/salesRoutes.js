
const express = require('express');
const { getSalesByUserId, createSale, updateSale, deleteSale } = require('../controllers/salesController');

const router = express.Router();


//router.get('/', getSales);

router.get('/:user', getSalesByUserId);

router.post('/', createSale);

router.put('/:id', updateSale);

router.delete('/:id', deleteSale);

module.exports = router; 
