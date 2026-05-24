const express = require('express');
const router = express.Router();
const PriceEntry = require('../models/PriceEntry');
const mongoose = require('mongoose');

// GET /api/history/:productId?range=7D|30D|60D|1Y
router.get('/:productId', async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const range = req.query.range || '30D';

    const daysMap = { '7D': 7, '30D': 30, '60D': 60, '1Y': 365 };
    const days = daysMap[range] || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Aggregate: for each day × platform, get the earliest price of that day
    const history = await PriceEntry.aggregate([
      {
        $match: {
          productId,
          scrapedAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$scrapedAt' },
            },
            platform: '$platform',
          },
          price: { $min: '$offerPrice' },
          platform: { $first: '$platform' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          platform: '$platform',
          price: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({ history, range });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
