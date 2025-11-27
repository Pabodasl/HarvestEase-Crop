const Sales = require('../models/salesModel');
const Expenses = require('../models/expensesModel');

const generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const salesData = await Sales.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          totalSales: { $sum: '$quantity' }
        }
      }
    ]);

    const expensesData = await Expenses.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      totalRevenue: salesData[0]?.totalRevenue || 0,
      totalSales: salesData[0]?.totalSales || 0,
      totalExpenses: expensesData[0]?.totalExpenses || 0,
      totalProfit:
        (salesData[0]?.totalRevenue || 0) -
        (expensesData[0]?.totalExpenses || 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateReport
};
