/**
 * dev-server.js — Development entry point with in-memory MongoDB.
 * Usage: node dev-server.js  (or: npm run dev:mem)
 *
 * Spins up an in-memory MongoDB binary (no local install needed),
 * auto-seeds 20 products with 180 days of price history, then starts Express.
 */
require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function seedDB() {
  const Product = require('./models/Product');
  const PriceEntry = require('./models/PriceEntry');

  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`📦 DB already has ${count} products — skipping seed`);
    return;
  }

  const PLATFORMS = ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales'];
  const PLATFORM_URLS = {
    amazon: 'https://www.amazon.in', flipkart: 'https://www.flipkart.com',
    croma: 'https://www.croma.com', reliance: 'https://www.reliancedigital.in',
    vijaysales: 'https://www.vijaysales.com',
  };
  const PLATFORM_BASE = { amazon: 0.97, flipkart: 0.95, croma: 1.0, reliance: 0.98, vijaysales: 0.99 };

  const PRODUCTS = [
    { name: 'Samsung Galaxy S24 Ultra 5G', brand: 'Samsung', category: 'electronics', description: 'Flagship with S Pen, 200MP camera, Snapdragon 8 Gen 3', rating: 4.6, reviewCount: 12480, specs: { mrp: 134999 } },
    { name: 'Apple iPhone 15 Pro Max 256GB', brand: 'Apple', category: 'electronics', description: 'Titanium design, A17 Pro chip, 48MP ProRAW', rating: 4.7, reviewCount: 18320, specs: { mrp: 159900 } },
    { name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', category: 'electronics', description: 'Industry-leading noise cancelling, 30hr battery', rating: 4.5, reviewCount: 8760, specs: { mrp: 34990 } },
    { name: 'Dell XPS 15 Laptop', brand: 'Dell', category: 'electronics', description: 'Intel Core i7, 16GB RAM, 512GB SSD, OLED', rating: 4.4, reviewCount: 3420, specs: { mrp: 189990 } },
    { name: "Levi's 511 Slim Fit Jeans", brand: "Levi's", category: 'fashion', description: 'Slim fit stretch denim', rating: 4.3, reviewCount: 5640, specs: { mrp: 4499 } },
    { name: 'Allen Solly Formal Shirt', brand: 'Allen Solly', category: 'fashion', description: 'Regular fit, pure cotton formal shirt', rating: 4.2, reviewCount: 3210, specs: { mrp: 1999 } },
    { name: 'Fabindia Cotton Kurta Set', brand: 'Fabindia', category: 'fashion', description: 'Hand block-printed kurta with palazzo', rating: 4.4, reviewCount: 2180, specs: { mrp: 3499 } },
    { name: 'Manyavar Embroidered Sherwani', brand: 'Manyavar', category: 'fashion', description: 'Traditional sherwani for weddings', rating: 4.5, reviewCount: 890, specs: { mrp: 14999 } },
    { name: 'Nike Air Max 270 Running Shoes', brand: 'Nike', category: 'shoes', description: 'Max Air heel unit, breathable mesh upper', rating: 4.5, reviewCount: 7890, specs: { mrp: 12995 } },
    { name: 'Adidas Ultraboost 23 Sneakers', brand: 'Adidas', category: 'shoes', description: 'Boost cushioning, Primeknit upper', rating: 4.6, reviewCount: 6540, specs: { mrp: 15999 } },
    { name: 'Bata Leather Oxford Shoes', brand: 'Bata', category: 'shoes', description: 'Genuine leather, Comfit insole', rating: 4.1, reviewCount: 4320, specs: { mrp: 3499 } },
    { name: 'Puma Suede Classic Sneakers', brand: 'Puma', category: 'shoes', description: 'Iconic suede upper, T-toe design', rating: 4.3, reviewCount: 3890, specs: { mrp: 7999 } },
    { name: 'Mamaearth Vitamin C Face Serum', brand: 'Mamaearth', category: 'beauty', description: 'Brightening with Vitamin C & Turmeric 30ml', rating: 4.2, reviewCount: 9870, specs: { mrp: 699 } },
    { name: 'Lakme Absolute Foundation SPF 20', brand: 'Lakme', category: 'beauty', description: 'Lightweight foundation, 12hr wear', rating: 4.0, reviewCount: 6540, specs: { mrp: 899 } },
    { name: 'Forest Essentials Facial Ubtan', brand: 'Forest Essentials', category: 'beauty', description: 'Ayurvedic cleanser with Vetiver & Rose', rating: 4.5, reviewCount: 2340, specs: { mrp: 1695 } },
    { name: 'Biotique Bio Kelp Protein Shampoo', brand: 'Biotique', category: 'beauty', description: 'Strengthening shampoo for all hair types', rating: 4.1, reviewCount: 11230, specs: { mrp: 349 } },
    { name: 'LG 1.5 Ton Inverter Split AC', brand: 'LG', category: 'appliances', description: 'Dual Inverter Compressor, Wi-Fi enabled, 5 Star', rating: 4.4, reviewCount: 5670, specs: { mrp: 54990 } },
    { name: 'Samsung 253L Double Door Refrigerator', brand: 'Samsung', category: 'appliances', description: 'Digital Inverter, SpaceMax technology', rating: 4.3, reviewCount: 4320, specs: { mrp: 29990 } },
    { name: 'Bosch 8kg Front Load Washing Machine', brand: 'Bosch', category: 'appliances', description: 'EcoSilence Drive, i-DOS technology', rating: 4.5, reviewCount: 3210, specs: { mrp: 64990 } },
    { name: 'Philips HL7756 Mixer Grinder', brand: 'Philips', category: 'appliances', description: '750W motor, 3 stainless steel jars', rating: 4.2, reviewCount: 8760, specs: { mrp: 4995 } },
  ];

  console.log('\n🌱 Seeding database...');
  let totalEntries = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const productData = PRODUCTS[i];
    const mrp = productData.specs.mrp;
    const product = await Product.create(productData);
    const entries = [];

    for (const platform of PLATFORMS) {
      const base = Math.round(mrp * PLATFORM_BASE[platform]);
      for (let d = 180; d >= 0; d--) {
        const date = new Date();
        date.setDate(date.getDate() - d);
        const trend = d > 90 ? 1.05 : 1.0;
        const jitter = Math.round((Math.random() - 0.4) * mrp * 0.08);
        const offerPrice = Math.max(Math.round(base * trend) + jitter, Math.round(mrp * 0.5));
        const saving = mrp - offerPrice;
        const discount = Math.round((saving / mrp) * 100);
        entries.push({
          productId: product._id, platform, mrp, offerPrice,
          discount, saving, inStock: Math.random() > 0.05,
          url: PLATFORM_URLS[platform], scrapedAt: date,
        });
      }
    }

    await PriceEntry.insertMany(entries, { ordered: false });
    totalEntries += entries.length;
    process.stdout.write(`\r  ✓ ${i + 1}/${PRODUCTS.length} products seeded`);
  }

  console.log(`\n✅ Seed complete: ${PRODUCTS.length} products, ${totalEntries} price entries\n`);
}

async function main() {
  // 1. Start in-memory MongoDB
  console.log('🚀 Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  console.log('✅ In-memory MongoDB ready');

  // 2. Connect mongoose
  await mongoose.connect(uri);

  // 3. Seed
  await seedDB();

  // 4. Disconnect mongoose so the server's own connection takes over
  await mongoose.disconnect();

  // 5. Start Express server (it will reconnect with the patched URI)
  require('./index.js');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await mongod.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('❌ Dev server failed:', err);
  process.exit(1);
});
