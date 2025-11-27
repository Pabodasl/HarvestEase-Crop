const Expenses = require('../models/expensesModel');

const getExpensesByUser = async (req, res) => {
  try {
    let filter = { user: req.params.user }; // Filter by user ID

    const expenses = await Expenses.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expenses.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    console.log("Request body for expense:", req.body);

    const expense = await Expenses.create(req.body);
    res.status(201).json(expense);  // Respond with the created expense
  } catch (error) {
    console.error("Error in createExpense:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await Expenses.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Expense deleted' });
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

const getAdminExpenses = async (req, res) => {
  try {
    const expenses = await Expenses.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getExpensesByUser,
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesSummary,
  getAdminExpenses
};
