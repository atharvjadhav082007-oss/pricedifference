const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const PriceEntry = require('../models/PriceEntry');

// GET /api/products — list products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'createdAt', page = 1, limit = 12 } = req.query;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    // Attach latest best price for each product
    const enriched = await Promise.all(
      products.map(async (p) => {
        const latestPrices = await PriceEntry.aggregate([
          { $match: { productId: p._id } },
          { $sort: { scrapedAt: -1 } },
          {
            $group: {
              _id: '$platform',
              offerPrice: { $first: '$offerPrice' },
              mrp: { $first: '$mrp' },
              discount: { $first: '$discount' },
              platform: { $first: '$platform' },
              inStock: { $first: '$inStock' },
              url: { $first: '$url' },
            },
          },
        ]);

        let bestPrice = null;
        let bestDiscount = 0;
        let bestPlatform = '';

        latestPrices.forEach((lp) => {
          if (!bestPrice || lp.offerPrice < bestPrice) {
            bestPrice = lp.offerPrice;
            bestPlatform = lp.platform;
          }
          if (lp.discount > bestDiscount) bestDiscount = lp.discount;
        });

        return {
          ...p,
          bestPrice,
          bestDiscount,
          bestPlatform,
          platformCount: latestPrices.length,
        };
      })
    );

    // Sort by discount if requested
    if (sort === 'discount') {
      enriched.sort((a, b) => b.bestDiscount - a.bestDiscount);
    } else if (sort === 'price_asc') {
      enriched.sort((a, b) => (a.bestPrice || 0) - (b.bestPrice || 0));
    }

    const total = await Product.countDocuments(filter);
    res.json({ products: enriched, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id — single product + all platform prices
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const pricesAgg = await PriceEntry.aggregate([
      { $match: { productId: product._id } },
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

    // Compute stats
    const prices = pricesAgg.map((p) => ({ ...p, _id: undefined }));
    const best = prices[0] || {};
    const maxDiscount = Math.max(...prices.map((p) => p.discount || 0), 0);
    const maxSaving = Math.max(...prices.map((p) => p.saving || 0), 0);

    res.json({
      product,
      prices,
      stats: {
        bestPrice: best.offerPrice || null,
        bestPlatform: best.platform || '',
        maxDiscount,
        maxSaving,
        platformCount: prices.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
