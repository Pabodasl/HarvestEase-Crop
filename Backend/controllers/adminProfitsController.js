const Sales = require('../models/salesModel');
const Expenses = require('../models/expensesModel');
const Farmer = require('../models/farmerModel');

const getSystemProfits = async (req, res) => {
  try {
    const { startDate, endDate, region } = req.query;
    let salesMatch = {};
    let expensesMatch = {};
    let farmerMatch = {};

    if (startDate && endDate) {
      salesMatch.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      expensesMatch.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (region && region !== 'all') {
      farmerMatch.region = region;
    }

    // Get farmer IDs if region filter is applied
    let farmerIds = [];
    if (region && region !== 'all') {
      const farmers = await Farmer.find(farmerMatch).select('_id');
      farmerIds = farmers.map(f => f._id);
      salesMatch.farmerId = { $in: farmerIds };
      expensesMatch.farmerId = { $in: farmerIds };
    }

    const [sales, expenses, farmers] = await Promise.all([
      Sales.aggregate([
        { $match: salesMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } }
          }
        }
      ]),
      Expenses.aggregate([
        { $match: expensesMatch },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: '$amount' }
          }
        }
      ]),
      Farmer.countDocuments(farmerMatch)
    ]);

    const revenue = sales[0]?.totalRevenue || 0;
    const expensesTotal = expenses[0]?.totalExpenses || 0;
    const profit = revenue - expensesTotal;
    const roi = expensesTotal > 0 ? (profit / expensesTotal * 100) : 0;

    res.status(200).json({
      revenue,
      expenses: expensesTotal,
      profit,
      roi: parseFloat(roi.toFixed(2)),
      farmerCount: farmers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCropWiseProfits = async (req, res) => {
  try {
    const { startDate, endDate, region } = req.query;
    let salesMatch = {};
    let expensesMatch = {};
    let farmerMatch = {};

    if (startDate && endDate) {
      salesMatch.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      expensesMatch.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (region && region !== 'all') {
      farmerMatch.region = region;
    }

    // Get farmer IDs if region filter is applied
    let farmerIds = [];
    if (region && region !== 'all') {
      const farmers = await Farmer.find(farmerMatch).select('_id');
      farmerIds = farmers.map(f => f._id);
      salesMatch.farmerId = { $in: farmerIds };
      expensesMatch.farmerId = { $in: farmerIds };
    }

    const [salesByCrop, expensesByCrop, generalExpenses] = await Promise.all([
      Sales.aggregate([
        { $match: salesMatch },
        {
          $group: {
            _id: '$cropType',
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
            farmerCount: { $addToSet: '$farmerId' }
          }
        },
        {
          $project: {
            crop: '$_id',
            totalRevenue: 1,
            farmerCount: { $size: '$farmerCount' }
          }
        }
      ]),
      Expenses.aggregate([
        { $match: { ...expensesMatch, crop: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: '$crop',
            totalExpenses: { $sum: '$amount' }
          }
        },
        {
          $project: {
            crop: '$_id',
            totalExpenses: 1
          }
        }
      ]),
      Expenses.aggregate([
        { $match: { ...expensesMatch, crop: { $exists: false } } },
        {
          $group: {
            _id: null,
            totalGeneralExpenses: { $sum: '$amount' }
          }
        }
      ])
    ]);

    const generalExpensesTotal = generalExpenses[0]?.totalGeneralExpenses || 0;
    const cropsWithRevenue = salesByCrop.length;
    const generalExpensesPerCrop = cropsWithRevenue > 0 ? generalExpensesTotal / cropsWithRevenue : 0;

    const result = salesByCrop.map(crop => {
      const cropExpenses = expensesByCrop.find(e => e.crop === crop.crop)?.totalExpenses || 0;
      const totalExpenses = cropExpenses + generalExpensesPerCrop;
      const profit = crop.totalRevenue - totalExpenses;
      const roi = totalExpenses > 0 ? (profit / totalExpenses * 100) : 0;

      return {
        crop: crop.crop,
        revenue: crop.totalRevenue,
        expenses: totalExpenses,
        profit,
        roi: parseFloat(roi.toFixed(2)),
        farmerCount: crop.farmerCount
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRegionalProfits = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let salesMatch = {};
    let expensesMatch = {};

    if (startDate && endDate) {
      salesMatch.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      expensesMatch.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [farmers, salesByRegion, expensesByRegion] = await Promise.all([
      Farmer.find().select('_id region'),
      Sales.aggregate([
        { $match: salesMatch },
        {
          $lookup: {
            from: 'farmers',
            localField: 'farmerId',
            foreignField: '_id',
            as: 'farmer'
          }
        },
        { $unwind: '$farmer' },
        {
          $group: {
            _id: '$farmer.region',
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
            farmerCount: { $addToSet: '$farmerId' }
          }
        },
        {
          $project: {
            region: '$_id',
            totalRevenue: 1,
            farmerCount: { $size: '$farmerCount' }
          }
        }
      ]),
      Expenses.aggregate([
        { $match: expensesMatch },
        {
          $lookup: {
            from: 'farmers',
            localField: 'farmerId',
            foreignField: '_id',
            as: 'farmer'
          }
        },
        { $unwind: '$farmer' },
        {
          $group: {
            _id: '$farmer.region',
            totalExpenses: { $sum: '$amount' }
          }
        },
        {
          $project: {
            region: '$_id',
            totalExpenses: 1
          }
        }
      ])
    ]);

    const regions = [...new Set(farmers.map(f => f.region))];
    const result = regions.map(region => {
      const regionSales = salesByRegion.find(s => s.region === region);
      const regionExpenses = expensesByRegion.find(e => e.region === region);
      
      const revenue = regionSales?.totalRevenue || 0;
      const expenses = regionExpenses?.totalExpenses || 0;
      const profit = revenue - expenses;
      const roi = expenses > 0 ? (profit / expenses * 100) : 0;
      const farmerCount = regionSales?.farmerCount || 0;
      const avgProfit = farmerCount > 0 ? profit / farmerCount : 0;

      return {
        region,
        revenue,
        expenses,
        profit,
        roi: parseFloat(roi.toFixed(2)),
        farmerCount,
        avgProfit
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSystemProfits,
  getCropWiseProfits,
  getRegionalProfits
};