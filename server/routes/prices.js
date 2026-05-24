const express = require('express');
const router = express.Router();
const PriceEntry = require('../models/PriceEntry');
const mongoose = require('mongoose');

// GET /api/prices/:productId — latest price per platform
router.get('/:productId', async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);

    const prices = await PriceEntry.aggregate([
      { $match: { productId } },
      { $sort: { scrapedAt: -1 } },
      {
        $group: {
          _id: '$platform',
          platform: { $first: '$platform' },
          mrp: { $first: '$mrp' },
          offerPrice: { $first: '$offerPrice' },
          discount: { $first: '$discount' },
          saving: { $first: '$saving' },
          inStock: { $first: '$inStock' },
          url: { $first: '$url' },
          scrapedAt: { $first: '$scrapedAt' },
        },
      },
      { $sort: { offerPrice: 1 } },
    ]);

    res.json({ prices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
