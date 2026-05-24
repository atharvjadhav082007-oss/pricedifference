/**
 * Mock scrapers — returns realistic randomised price data per platform.
 * Replace each function body with real API calls when you have keys.
 */

const PLATFORMS = {
  amazon:     { base: 0.97, color: '#FF9900', url: 'https://www.amazon.in' },
  flipkart:   { base: 0.95, color: '#2874F0', url: 'https://www.flipkart.com' },
  croma:      { base: 1.00, color: '#E53935', url: 'https://www.croma.com' },
  reliance:   { base: 0.98, color: '#1565C0', url: 'https://www.reliancedigital.in' },
  vijaysales: { base: 0.99, color: '#7B1FA2', url: 'https://www.vijaysales.com' },
  meesho:     { base: 0.92, color: '#F43397', url: 'https://www.meesho.com' },
  ajio:       { base: 0.88, color: '#E91E63', url: 'https://www.ajio.com' },
  myntra:     { base: 0.90, color: '#FF3F6C', url: 'https://www.myntra.com' },
  nykaa:      { base: 0.93, color: '#FC2779', url: 'https://www.nykaa.com' },
};

function jitter(value, pct = 0.08) {
  const factor = 1 + (Math.random() - 0.5) * pct;
  return Math.round(value * factor);
}

function buildPriceData(platform, mrp) {
  const cfg = PLATFORMS[platform];
  const offerPrice = Math.round(jitter(mrp * cfg.base));
  const saving = mrp - offerPrice;
  const discount = Math.round((saving / mrp) * 100);
  const inStock = Math.random() > 0.1; // 90% chance in stock
  return {
    platform,
    mrp,
    offerPrice,
    discount,
    saving,
    inStock,
    url: cfg.url,
  };
}

async function scrapeAmazon(productName, mrp) {
  // TODO: Replace with RapidAPI "Real-Time Amazon Data" call
  return buildPriceData('amazon', mrp);
}

async function scrapeFlipkart(productName, mrp) {
  // TODO: Replace with RapidAPI "Real-Time Flipkart Data" call
  return buildPriceData('flipkart', mrp);
}

async function scrapeCroma(productName, mrp) {
  // TODO: Replace with SerpAPI Google Shopping
  return buildPriceData('croma', mrp);
}

async function scrapeReliance(productName, mrp) {
  // TODO: Replace with SerpAPI Google Shopping
  return buildPriceData('reliance', mrp);
}

async function scrapeVijay(productName, mrp) {
  // TODO: Replace with SerpAPI Google Shopping
  return buildPriceData('vijaysales', mrp);
}

async function scrapeMeesho(productName, mrp) {
  // TODO: Replace with Oxylabs / ScraperAPI
  return buildPriceData('meesho', mrp);
}

async function scrapeAjio(productName, mrp) {
  // TODO: Replace with Oxylabs / ScraperAPI
  return buildPriceData('ajio', mrp);
}

async function scrapeAll(productName, mrp) {
  const results = await Promise.allSettled([
    scrapeAmazon(productName, mrp),
    scrapeFlipkart(productName, mrp),
    scrapeCroma(productName, mrp),
    scrapeReliance(productName, mrp),
    scrapeVijay(productName, mrp),
    scrapeMeesho(productName, mrp),
    scrapeAjio(productName, mrp),
  ]);
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}

module.exports = {
  scrapeAmazon,
  scrapeFlipkart,
  scrapeCroma,
  scrapeReliance,
  scrapeVijay,
  scrapeMeesho,
  scrapeAjio,
  scrapeAll,
  PLATFORMS,
};
