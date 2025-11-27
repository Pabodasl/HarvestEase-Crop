const express = require('express');
const { getProfits } = require('../controllers/profitsController');

const router = express.Router();

router.get('/', getProfits);

module.exports = router; 
