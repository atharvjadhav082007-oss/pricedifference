const cron = require('node-cron');
const Product = require('../models/Product');
const PriceEntry = require('../models/PriceEntry');
const { scrapeAll } = require('../utils/scraper');

// Run every 6 hours: 0 */6 * * *
function startPriceScraper() {
  cron.schedule('0 */6 * * *', async () => {
    console.log('[PriceScraper] Starting price update job...');
    try {
      const products = await Product.find();
      let updated = 0;

      for (const product of products) {
        try {
          const results = await scrapeAll(product.name, product.specs?.mrp || 30000);
          for (const data of results) {
            await PriceEntry.create({ productId: product._id, ...data });
          }
          updated++;
        } catch (err) {
          console.error(`[PriceScraper] Failed for ${product.name}:`, err.message);
        }
      }

      console.log(`[PriceScraper] Updated prices for ${updated}/${products.length} products`);
    } catch (err) {
      console.error('[PriceScraper] Job error:', err);
    }
  });

  console.log('[PriceScraper] Cron job scheduled — runs every 6 hours');
}

module.exports = { startPriceScraper };
