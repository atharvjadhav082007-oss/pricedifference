const cron = require('node-cron');
const Alert = require('../models/Alert');
const PriceEntry = require('../models/PriceEntry');
const Product = require('../models/Product');
const { sendAlertEmail } = require('../utils/emailer');

// Run every hour: 0 * * * *
function startAlertChecker() {
  cron.schedule('0 * * * *', async () => {
    console.log('[AlertChecker] Checking price alerts...');
    try {
      const alerts = await Alert.find({ triggered: false });

      for (const alert of alerts) {
        try {
          const best = await PriceEntry.findOne({ productId: alert.productId })
            .sort({ offerPrice: 1 });

          if (best && best.offerPrice <= alert.targetPrice) {
            const product = await Product.findById(alert.productId);
            await sendAlertEmail(alert.email, product, best);
            await Alert.findByIdAndUpdate(alert._id, { triggered: true });
            console.log(`[AlertChecker] Alert triggered for ${alert.email} — ${product.name}`);
          }
        } catch (err) {
          console.error(`[AlertChecker] Failed for alert ${alert._id}:`, err.message);
        }
      }

      console.log(`[AlertChecker] Checked ${alerts.length} alerts`);
    } catch (err) {
      console.error('[AlertChecker] Job error:', err);
    }
  });

  console.log('[AlertChecker] Cron job scheduled — runs every hour');
}

module.exports = { startAlertChecker };
