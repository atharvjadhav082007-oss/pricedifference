import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlatformCard from '../components/PlatformCard';
import PriceHistoryChart from '../components/PriceHistoryChart';
import { getPrices, getProduct } from '../api';

export default function Compare() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getProduct(id), getPrices(id)])
      .then(([prodData, priceData]) => {
        setProduct(prodData.product);
        setPrices(priceData.prices || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const lowestPrice = prices[0]?.offerPrice;

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="detail-page fade-in">
          <button className="back-link" onClick={() => navigate(-1)} id="compare-back-btn">
            ← Back
          </button>

          {product && (
            <h1 className="detail-name" style={{ marginBottom: 20 }}>
              Compare: {product.name}
            </h1>
          )}

          {loading ? (
            <div className="platform-grid">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="skeleton" style={{ height: 120, borderRadius: 8 }} />
              ))}
            </div>
          ) : (
            <>
              <p className="section-subtitle">
                <span>🏪</span> Platform comparison
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

              <p className="section-subtitle">
                <span>📈</span> Price history
              </p>
              <PriceHistoryChart productId={id} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
