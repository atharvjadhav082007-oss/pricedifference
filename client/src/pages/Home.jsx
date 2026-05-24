import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryPills from '../components/CategoryPills';
import ProductCard from '../components/ProductCard';
import AdBanner from '../components/AdBanner';
import BrowseDirectly from '../components/BrowseDirectly';
import CuratedSection from '../components/CuratedSection';
import BottomNav from '../components/BottomNav';
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

const STATS = [
  { value: '10+', label: 'Platforms' },
  { value: '50K+', label: 'Products' },
  { value: '₹2Cr+', label: 'Saved daily' },
  { value: '1M+', label: 'Users' },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchQuery = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort: 'discount', limit: 20 };
      if (category !== 'all') params.category = category;
      if (searchQuery) params.search = searchQuery;
      const data = await getProducts(params);
      setProducts(data.products || []);
    } catch (err) {
      setError('Could not load products. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <>
      <Navbar />
      <div className="page-content">
        <AdBanner />
        
        {/* Hero */}
        <section className="hero" id="hero-section">
          <div className="hero-badge">COMPARE PRICES ACROSS 10+ PLATFORMS</div>
          <h1>
            Stop Overpaying.<br />
            <span className="accent">Find the Best Price.</span>
          </h1>
          <p className="hero-sub">
            Real-time price comparison across Amazon, Flipkart, Meesho, Ajio, Croma, Reliance &amp; more.
          </p>

          {/* Live stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '28px', flexWrap: 'wrap' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--orange)' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-hint)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <BrowseDirectly />
        
        <CuratedSection />

        <div style={{ padding: '0 20px' }}>
          <CategoryPills active={category} onChange={setCategory} />
        </div>

        {/* Trending section */}
        <section className="section" id="trending-section">
          <div className="section-header">
            <span className="section-icon">🔥</span>
            <h2 className="section-title">
              {searchQuery ? `Results for "${searchQuery}"` : 'Trending now'}
            </h2>
            {products.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-hint)' }}>
                {products.length} products
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
                      <div className="empty-state-icon">🔍</div>
                      <h3>No products found</h3>
                      <p>Try a different search or category</p>
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
