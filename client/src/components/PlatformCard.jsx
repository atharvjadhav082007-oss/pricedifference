const PLATFORM_COLORS = {
  amazon:     '#FF9900',
  flipkart:   '#2874F0',
  croma:      '#E53935',
  reliance:   '#1565C0',
  vijaysales: '#7B1FA2',
  meesho:     '#F43397',
  ajio:       '#E91E63',
  myntra:     '#FF3F6C',
  nykaa:      '#FC2779',
};

export default function PlatformCard({ priceData, isLowest }) {
  const { platform, mrp, offerPrice, discount, inStock, url } = priceData;
  const color = PLATFORM_COLORS[platform] || '#888';

  const displayName = platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div className={`plat-card ${isLowest ? 'lowest' : ''}`} id={`plat-card-${platform}`}>
      {isLowest && <span className="lowest-badge">LOWEST PRICE</span>}

      <div>
        <span className="plat-dot" style={{ background: color }} />
      </div>

      <p className="plat-name">{displayName}</p>
      <p className="plat-price">₹{offerPrice?.toLocaleString('en-IN') ?? '—'}</p>
      {discount > 0 && (
        <p className="plat-off">{discount}% off</p>
      )}

      <div className={`plat-stock ${inStock ? 'in' : 'out'}`}>
        <span>●</span>
        {inStock ? 'In Stock' : 'Out of Stock'}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="plat-buy-link"
          onClick={(e) => e.stopPropagation()}
          id={`plat-buy-${platform}`}
        >
          Buy Now →
        </a>
      )}
    </div>
  );
}

export { PLATFORM_COLORS };
