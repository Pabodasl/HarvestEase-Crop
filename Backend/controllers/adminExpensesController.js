const Expenses = require('../models/expensesModel');
const Farmer = require('../models/farmerModel');
const User = require('../models/UserModel'); // Ensure User model is imported

const getExpenses = async (req, res) => {
  try {
    const { farmerId, category, crop, startDate, endDate, region } = req.query;
    let filter = {};

    if (farmerId && farmerId !== 'all') {
      filter.farmerId = farmerId;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (crop && crop !== 'all') {
      filter.crop = crop;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (region && region !== 'all') {
      const farmersInRegion = await Farmer.find({ region }).select('_id');
      const farmerIds = farmersInRegion.map(f => f._id);
      filter.farmerId = { $in: farmerIds };
    }

    const expenses = await Expenses.find(filter)
      .populate('farmerId', 'name region')
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense = new Expenses(req.body);
    await expense.save();
    
    // Update farmer stats
    await Farmer.findByIdAndUpdate(req.body.farmerId, {
      $inc: { totalExpenses: req.body.amount }
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expenses.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const amountDiff = req.body.amount - expense.amount;
    const updatedExpense = await Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Update farmer stats if amount changed
    if (amountDiff !== 0) {
      await Farmer.findByIdAndUpdate(updatedExpense.farmerId, {
        $inc: { totalExpenses: amountDiff }
      });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expenses.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await Expenses.findByIdAndDelete(req.params.id);
    
    // Update farmer stats
    await Farmer.findByIdAndUpdate(expense.farmerId, {
      $inc: { totalExpenses: -expense.amount }
    });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpensesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};

    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const summary = await Expenses.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          count: 1,
          avgAmount: { $round: ['$avgAmount', 2] }
        }
      }
    ]);

    res.status(200).json(summary[0] || {
      totalAmount: 0,
      count: 0,
      avgAmount: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpensesByFarmers = async (req, res) => {
  try {
    // Find all users with the role "farmer"
    const farmers = await User.find({ role: 'farmer' }).select('_id');
    const farmerIds = farmers.map(farmer => farmer._id);

    // Fetch expenses for these farmers
    const expenses = await Expenses.find({ user: { $in: farmerIds } })
      .populate('user', 'name') // Populate user details
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesSummary,
  getExpensesByFarmers // Added new method to exports
};