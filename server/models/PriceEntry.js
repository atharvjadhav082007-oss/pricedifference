const mongoose = require('mongoose');

const PriceEntrySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  platform: {
    type: String,
    enum: ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'meesho', 'ajio', 'myntra', 'nykaa'],
    required: true
  },
  mrp: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  saving: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  url: { type: String, default: '' },
  scrapedAt: { type: Date, default: Date.now }
});

PriceEntrySchema.index({ productId: 1, platform: 1, scrapedAt: -1 });

module.exports = mongoose.model('PriceEntry', PriceEntrySchema);
