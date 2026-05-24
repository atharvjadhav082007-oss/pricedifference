require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const PriceEntry = require('./models/PriceEntry');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/priceradar';

const PLATFORMS = ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales'];

const PLATFORM_COLORS = {
  amazon: '#FF9900',
  flipkart: '#2874F0',
  croma: '#E53935',
  reliance: '#1565C0',
  vijaysales: '#7B1FA2',
};

const PLATFORM_URLS = {
  amazon: 'https://www.amazon.in',
  flipkart: 'https://www.flipkart.com',
  croma: 'https://www.croma.com',
  reliance: 'https://www.reliancedigital.in',
  vijaysales: 'https://www.vijaysales.com',
};

const PLATFORM_BASE = {
  amazon: 0.97,
  flipkart: 0.95,
  croma: 1.00,
  reliance: 0.98,
  vijaysales: 0.99,
};

const SEED_PRODUCTS = [
  // Electronics
  {
    name: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'Samsung',
    category: 'electronics',
    description: 'Flagship smartphone with S Pen, 200MP camera, Snapdragon 8 Gen 3',
    rating: 4.6,
    reviewCount: 12480,
    specs: { mrp: 134999, storage: '256GB', ram: '12GB', color: 'Titanium Black' },
  },
  {
    name: 'Apple iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    category: 'electronics',
    description: 'Titanium design, A17 Pro chip, 48MP ProRAW camera system',
    rating: 4.7,
    reviewCount: 18320,
    specs: { mrp: 159900, storage: '256GB', color: 'Natural Titanium' },
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'electronics',
    description: 'Industry-leading noise cancelling, 30hr battery, Hi-Res Audio',
    rating: 4.5,
    reviewCount: 8760,
    specs: { mrp: 34990, connectivity: 'Bluetooth 5.2', weight: '250g' },
  },
  {
    name: 'Dell XPS 15 9530 Laptop',
    brand: 'Dell',
    category: 'electronics',
    description: 'Intel Core i7-13700H, 16GB RAM, 512GB SSD, OLED display',
    rating: 4.4,
    reviewCount: 3420,
    specs: { mrp: 189990, ram: '16GB', storage: '512GB', display: '15.6" OLED' },
  },
  // Fashion
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    brand: 'Levi\'s',
    category: 'fashion',
    description: 'Slim fit through thigh and leg opening, stretch denim',
    rating: 4.3,
    reviewCount: 5640,
    specs: { mrp: 4499, fit: 'Slim', fabric: 'Stretch Denim' },
  },
  {
    name: 'Allen Solly Men\'s Formal Shirt',
    brand: 'Allen Solly',
    category: 'fashion',
    description: 'Regular fit, full sleeve, pure cotton formal shirt',
    rating: 4.2,
    reviewCount: 3210,
    specs: { mrp: 1999, fabric: '100% Cotton', fit: 'Regular' },
  },
  {
    name: 'Fabindia Women\'s Kurta Set',
    brand: 'Fabindia',
    category: 'fashion',
    description: 'Hand block-printed cotton kurta with palazzo pants',
    rating: 4.4,
    reviewCount: 2180,
    specs: { mrp: 3499, fabric: 'Cotton', occasion: 'Ethnic Casual' },
  },
  {
    name: 'Manyavar Men\'s Sherwani',
    brand: 'Manyavar',
    category: 'fashion',
    description: 'Traditional embroidered sherwani for wedding occasions',
    rating: 4.5,
    reviewCount: 890,
    specs: { mrp: 14999, fabric: 'Art Silk', occasion: 'Wedding' },
  },
  // Shoes
  {
    name: 'Nike Air Max 270 Running Shoes',
    brand: 'Nike',
    category: 'shoes',
    description: 'Max Air heel unit, breathable mesh upper, rubber outsole',
    rating: 4.5,
    reviewCount: 7890,
    specs: { mrp: 12995, type: 'Running', sole: 'Rubber' },
  },
  {
    name: 'Adidas Ultraboost 23 Sneakers',
    brand: 'Adidas',
    category: 'shoes',
    description: 'Boost cushioning, Primeknit upper, Continental rubber outsole',
    rating: 4.6,
    reviewCount: 6540,
    specs: { mrp: 15999, type: 'Running', cushioning: 'Boost' },
  },
  {
    name: 'Bata Men\'s Formal Leather Shoes',
    brand: 'Bata',
    category: 'shoes',
    description: 'Genuine leather upper, Comfit insole, classic oxford style',
    rating: 4.1,
    reviewCount: 4320,
    specs: { mrp: 3499, material: 'Genuine Leather', type: 'Formal' },
  },
  {
    name: 'Puma Suede Classic Sneakers',
    brand: 'Puma',
    category: 'shoes',
    description: 'Iconic suede upper, T-toe design, foam insole',
    rating: 4.3,
    reviewCount: 3890,
    specs: { mrp: 7999, material: 'Suede', type: 'Lifestyle' },
  },
  // Beauty
  {
    name: 'Mamaearth Vitamin C Face Serum',
    brand: 'Mamaearth',
    category: 'beauty',
    description: 'Brightening serum with Vitamin C and Turmeric, 30ml',
    rating: 4.2,
    reviewCount: 9870,
    specs: { mrp: 699, volume: '30ml', skinType: 'All Skin Types' },
  },
  {
    name: 'Lakme Absolute Skin Dew SPF Foundation',
    brand: 'Lakme',
    category: 'beauty',
    description: 'Lightweight foundation with SPF 20, 12hr wear',
    rating: 4.0,
    reviewCount: 6540,
    specs: { mrp: 899, coverage: 'Medium', finish: 'Dewy' },
  },
  {
    name: 'Forest Essentials Facial Ubtan',
    brand: 'Forest Essentials',
    category: 'beauty',
    description: 'Ayurvedic facial cleanser with Vetiver and Rose water',
    rating: 4.5,
    reviewCount: 2340,
    specs: { mrp: 1695, type: 'Face Wash', volume: '150g' },
  },
  {
    name: 'Biotique Bio Kelp Protein Shampoo',
    brand: 'Biotique',
    category: 'beauty',
    description: 'For falling hair, repairs & strengthens from root to tip',
    rating: 4.1,
    reviewCount: 11230,
    specs: { mrp: 349, volume: '340ml', hairType: 'All Hair Types' },
  },
  // Appliances
  {
    name: 'LG 1.5 Ton 5 Star Inverter Split AC',
    brand: 'LG',
    category: 'appliances',
    description: 'Dual Inverter Compressor, Wi-Fi enabled, ADU display',
    rating: 4.4,
    reviewCount: 5670,
    specs: { mrp: 54990, capacity: '1.5 Ton', starRating: 5, type: 'Split' },
  },
  {
    name: 'Samsung 253L Double Door Refrigerator',
    brand: 'Samsung',
    category: 'appliances',
    description: 'Digital Inverter, SpaceMax technology, Twin Cooling Plus',
    rating: 4.3,
    reviewCount: 4320,
    specs: { mrp: 29990, capacity: '253L', type: 'Double Door', starRating: 3 },
  },
  {
    name: 'Bosch 8kg Front Load Washing Machine',
    brand: 'Bosch',
    category: 'appliances',
    description: 'EcoSilence Drive, ActiveWater Plus, i-DOS technology',
    rating: 4.5,
    reviewCount: 3210,
    specs: { mrp: 64990, capacity: '8kg', type: 'Front Load', rpm: 1200 },
  },
  {
    name: 'Philips HL7756 Mixer Grinder',
    brand: 'Philips',
    category: 'appliances',
    description: '750W motor, 3 stainless steel jars, vortex technology',
    rating: 4.2,
    reviewCount: 8760,
    specs: { mrp: 4995, power: '750W', jars: 3, warranty: '2 years' },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await PriceEntry.deleteMany({});
    console.log('Cleared existing data');

    let totalEntries = 0;

    for (const productData of SEED_PRODUCTS) {
      const mrp = productData.specs.mrp;
      const product = await Product.create(productData);
      console.log(`Created product: ${product.name}`);

      // Seed 180 days of price history per platform
      const entries = [];
      for (const platform of PLATFORMS) {
        const basePrice = Math.round(mrp * PLATFORM_BASE[platform]);

        for (let d = 180; d >= 0; d--) {
          const date = new Date();
          date.setDate(date.getDate() - d);

          // Add some realistic price variation over time
          const trend = d > 90 ? 1.05 : 1.0; // slight price drop over time
          const jitterAmt = Math.round((Math.random() - 0.4) * mrp * 0.08);
          const rawPrice = Math.round(basePrice * trend) + jitterAmt;
          const offerPrice = Math.max(rawPrice, Math.round(mrp * 0.5)); // min 50% of MRP
          const saving = mrp - offerPrice;
          const discount = Math.round((saving / mrp) * 100);

          entries.push({
            productId: product._id,
            platform,
            mrp,
            offerPrice,
            discount,
            saving,
            inStock: Math.random() > 0.05,
            url: PLATFORM_URLS[platform],
            scrapedAt: date,
          });
        }
      }

      // Bulk insert for speed
      await PriceEntry.insertMany(entries, { ordered: false });
      totalEntries += entries.length;
      console.log(`  → Seeded ${entries.length} price entries across ${PLATFORMS.length} platforms`);
    }

    console.log(`\n✅ Seeded ${SEED_PRODUCTS.length} products and ${totalEntries} price entries`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
