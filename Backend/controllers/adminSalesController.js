const Sales = require('../models/salesModel');
const Farmer = require('../models/farmerModel');

const getSales = async (req, res) => {
  try {
    const { farmerId, cropType, startDate, endDate, region } = req.query;
    let filter = {};

    // if (farmerId && farmerId !== 'all') {
    //   filter.farmerId = farmerId;
    // }

    // if (cropType && cropType !== 'all') {
    //   filter.cropType = cropType;
    // }

    // if (startDate && endDate) {
    //   filter.date = {
    //     $gte: new Date(startDate),
    //     $lte: new Date(endDate)
    //   };
    // }

    // if (region && region !== 'all') {
    //   const farmersInRegion = await Farmer.find({ region }).select('_id');
    //   const farmerIds = farmersInRegion.map(f => f._id);
    //   filter.farmerId = { $in: farmerIds };
    // }

    const sales = await Sales.find();

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const sale = new Sales(req.body);
    await sale.save();
    
    // Update farmer stats
    await Farmer.findByIdAndUpdate(req.body.farmerId, {
      $inc: { totalSales: req.body.quantity * req.body.price }
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateSale = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const oldAmount = sale.quantity * sale.price;
    const updatedSale = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const newAmount = updatedSale.quantity * updatedSale.price;
    const amountDiff = newAmount - oldAmount;

    // Update farmer stats if amount changed
    if (amountDiff !== 0) {
      await Farmer.findByIdAndUpdate(updatedSale.farmerId, {
        $inc: { totalSales: amountDiff }
      });
    }

    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    await Sales.findByIdAndDelete(req.params.id);
    
    // Update farmer stats
    await Farmer.findByIdAndUpdate(sale.farmerId, {
      $inc: { totalSales: -(sale.quantity * sale.price) }
    });

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = {};

    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const summary = await Sales.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalQuantity: 1,
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] }
        }
      }
    ]);

    res.status(200).json(summary[0] || {
      totalRevenue: 0,
      totalQuantity: 0,
      count: 0,
      avgPrice: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSales,
  createSale,
  updateSale,
  deleteSale,
  getSalesSummary
};