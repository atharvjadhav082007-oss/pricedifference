import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import CategoryPills from '../components/CategoryPills';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';

function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line price" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  );
}

export default function Deals() {
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort: 'discount', limit: 24 };
      if (category !== 'all') params.category = category;
      const data = await getProducts(params);
      setProducts(data.products || []);
    } catch (err) {
      setError('Could not load deals. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return (
    <>
      <Navbar />
      <div className="page-content">
        {/* Deals Hero */}
        <section className="deals-hero" id="deals-hero-section">
          <div className="deals-badge">🏷️ MAXIMUM PRICE DROPS TODAY</div>
          <h1>
            Deal Radar.<br />
            <span className="accent">The Greatest Discounts.</span>
          </h1>
          <p className="deals-sub">
            Scanned real-time maximum percentage cuts across Amazon, AJIO, Meesho, Flipkart, and Croma. Save up to 80%!
          </p>
        </section>

        {/* Category Filter */}
        <div style={{ padding: '0 20px', marginTop: '24px' }}>
          <CategoryPills active={category} onChange={setCategory} />
        </div>

        {/* Deals Listing */}
        <section className="section" id="deals-listing-section">
          <div className="section-header">
            <span className="section-icon">🔥</span>
            <h2 className="section-title">
              Top Price Drops
            </h2>
            {products.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-hint)' }}>
                {products.length} hot deals
              </span>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="product-grid">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.length > 0
                ? products.map((p) => <ProductCard key={p._id} product={p} />)
                : !error && (
                    <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                      <div className="empty-state-icon">💸</div>
                      <h3>No discounts found</h3>
                      <p>Check back shortly for new price drops</p>
                    </div>
                  )
            }
          </div>
        </section>
      </div>
      <BottomNav />
    </>
  );
}
