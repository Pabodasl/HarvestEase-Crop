const Sales = require('../models/salesModel');
const Expenses = require('../models/expensesModel');

const getProfits = async (req, res) => {
  try {
    const { frequency } = req.query;
    let filter = {};

    if (frequency && frequency !== 'all') {
      const days = parseInt(frequency);
      filter.date = {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      };
    }

    const [sales, expenses] = await Promise.all([
      Sales.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $multiply: ['$quantity', '$price']
              }
            }
          }
        }
      ]),
      Expenses.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$amount'
            }
          }
        }
      ])
    ]);

    res.status(200).json({
      revenue: sales[0]?.total || 0,
      expenses: expenses[0]?.total || 0,
      profit: (sales[0]?.total || 0) - (expenses[0]?.total || 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfits
};
