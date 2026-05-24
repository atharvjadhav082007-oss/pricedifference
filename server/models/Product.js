const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, default: '' },
  category: {
    type: String,
    enum: ['electronics', 'fashion', 'shoes', 'beauty', 'appliances'],
    required: true
  },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  rating: { type: Number, default: 4.2 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
