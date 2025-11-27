const Farmer = require('../models/farmerModel');
const Sales = require('../models/salesModel');
const Expenses = require('../models/expensesModel');
const User = require('../models/UserModel');


//TODO:  write method to get all users whitch is role as farmers

const getAllFarmers = async (req, res) => {
  try {
    let filter = {role: "farmer"};
    const farmers = await User.find(filter).sort({ name: 1 });
    console.log("Farmers: ", farmers);
    
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getFarmers = async (req, res) => {
  try {
    const { region, status } = req.query;
    let filter = {};

    // if (region && region !== 'all') {
    //   filter.region = region;
    // }

    // if (status && status !== 'all') {
    //   filter.status = status;
    // }

    const farmers = await Farmer.find().sort({ name: 1 });
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFarmer = async (req, res) => {
  try {
    const updatedFarmer = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedFarmer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFarmer = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFarmerStats = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { startDate, endDate } = req.query;
    let match = { farmerId };

    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [salesSummary, expensesSummary] = await Promise.all([
      Sales.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
            salesCount: { $sum: 1 }
          }
        }
      ]),
      Expenses.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: '$amount' },
            expensesCount: { $sum: 1 }
          }
        }
      ])
    ]);

    const revenue = salesSummary[0]?.totalRevenue || 0;
    const expenses = expensesSummary[0]?.totalExpenses || 0;
    const profit = revenue - expenses;
    const roi = expenses > 0 ? (profit / expenses * 100) : 0;

    res.status(200).json({
      revenue,
      expenses,
      profit,
      roi: parseFloat(roi.toFixed(2)),
      salesCount: salesSummary[0]?.salesCount || 0,
      expensesCount: expensesSummary[0]?.expensesCount || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFarmers,
  updateFarmer,
  deleteFarmer,
  getFarmerStats
};