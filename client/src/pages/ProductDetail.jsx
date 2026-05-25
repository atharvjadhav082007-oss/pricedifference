import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatChip from '../components/StatChip';
import PlatformCard from '../components/PlatformCard';
import PriceHistoryChart from '../components/PriceHistoryChart';
import AlertForm from '../components/AlertForm';
import { getProduct } from '../api';
import { useSavedItems } from '../context/SavedItemsContext';

const CATEGORY_EMOJI = {
  electronics: '💻',
  fashion: '👕',
  shoes: '👟',
  beauty: '💄',
  appliances: '🏠',
};

function DetailSkeleton() {
  return (
    <div className="detail-page page-content">
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 140, height: 140, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton skeleton-line" style={{ height: 18, width: '80%' }} />
          <div className="skeleton skeleton-line" style={{ height: 12, width: '60%' }} />
          <div className="skeleton skeleton-line" style={{ height: 12, width: '50%' }} />
        </div>
      </div>
      <div className="stat-chips" style={{ marginBottom: 20 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 8 }} />)}
      </div>
      <div className="skeleton" style={{ height: 48, borderRadius: 10, marginBottom: 12 }} />
      <div className="platform-grid">
        {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 8 }} />)}
      </div>
      <div className="skeleton" style={{ height: 240, borderRadius: 10 }} />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { isInWishlist, isInFavorite, toggleWishlist, toggleFavorite } = useSavedItems();
  const isWishlisted = isInWishlist(id);
  const isFavorited = isInFavorite(id);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProduct(id)
      .then(setData)
      .catch(() => setError('Product not found or server unavailable.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><DetailSkeleton /></>;
  if (error)   return (
    <>
      <Navbar />
      <div className="page-content detail-page">
        <Link to="/" className="back-link">← Back to Products</Link>
        <div className="error-msg">{error}</div>
      </div>
    </>
  );

  const { product, prices = [], stats = {} } = data;
  const {
    name, brand, category, description, rating, reviewCount,
  } = product;

  const emoji = CATEGORY_EMOJI[category] || '📦';
  const lowestPrice = prices[0]?.offerPrice;

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="detail-page fade-in">

          {/* Back link */}
          <button className="back-link" onClick={() => navigate(-1)} id="back-btn">
            ← Back to Products
          </button>

          {/* Category label */}
          <div className="category-label">{category?.toUpperCase()}</div>

          {/* Top section */}
          <div className="detail-top">
            <div className="detail-img-box" aria-label={`Product image: ${name}`}>
              {emoji}
            </div>

            <div className="detail-info">
              <h1 className="detail-name">{name}</h1>
              {brand && (
                <p style={{ fontSize: 11, color: 'var(--orange)', marginBottom: 6, fontWeight: 500 }}>
                  {brand}
                </p>
              )}
              <p className="detail-desc">{description}</p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, margin: '12px 0 16px 0', flexWrap: 'wrap' }}>
                <button
                  className={`detail-action-btn detail-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <span className="btn-icon">♥</span>
                  {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button
                  className={`detail-action-btn detail-favorite-btn ${isFavorited ? 'active' : ''}`}
                  onClick={() => toggleFavorite(product)}
                  aria-label={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <span className="btn-icon">★</span>
                  {isFavorited ? 'In Favorites' : 'Add to Favorites'}
                </button>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ color: 'var(--orange)', fontSize: 13 }}>
                  {'★'.repeat(Math.floor(rating || 4))}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {rating?.toFixed(1)} ({reviewCount?.toLocaleString('en-IN')} reviews)
                </span>
              </div>

              {/* Stat chips */}
              <div className="stat-chips">
                <StatChip
                  label="Best Price"
                  value={stats.bestPrice ? `₹${stats.bestPrice.toLocaleString('en-IN')}` : '—'}
                  color="white"
                />
                <StatChip
                  label="Max Discount"
                  value={stats.maxDiscount ? `${stats.maxDiscount}%` : '—'}
                  color="orange"
                />
                <StatChip
                  label="Max Saving"
                  value={stats.maxSaving ? `₹${stats.maxSaving.toLocaleString('en-IN')}` : '—'}
                  color="green"
                />
                <StatChip
                  label="Platforms"
                  value={stats.platformCount || prices.length}
                  color="orange"
                />
              </div>
            </div>
          </div>

          {/* Alert toggle */}
          <button
            id="alert-toggle-btn"
            className="alert-toggle-btn"
            onClick={() => setShowAlert((v) => !v)}
            aria-expanded={showAlert}
          >
            <span>🔔</span>
            {showAlert ? 'Hide alert form' : 'Set Price Alert — get notified by email'}
          </button>

          {showAlert && <AlertForm productId={id} />}

          {/* Compare section */}
          {prices.length > 0 && (
            <>
              <p className="section-subtitle">
                <span>🏪</span> Compare prices across platforms
              </p>
              <div className="platform-grid">
                {prices.map((p) => (
                  <PlatformCard
                    key={p.platform}
                    priceData={p}
                    isLowest={p.offerPrice === lowestPrice}
                  />
                ))}
              </div>
            </>
          )}

          {/* Price history chart */}
          <p className="section-subtitle" style={{ marginTop: 4 }}>
            <span>📈</span> Price history
          </p>
          <PriceHistoryChart productId={id} />

        </div>
      </div>
    </>
  );
}
