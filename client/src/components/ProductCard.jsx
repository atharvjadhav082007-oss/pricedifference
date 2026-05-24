import { useNavigate } from 'react-router-dom';

const CATEGORY_EMOJI = {
  electronics: '💻',
  fashion: '👕',
  shoes: '👟',
  beauty: '💄',
  appliances: '🏠',
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span>({rating?.toFixed(1)})</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const {
    _id,
    name,
    category,
    rating = 4.2,
    bestPrice,
    bestDiscount,
    bestPlatform,
    specs,
  } = product;

  const mrp = specs?.mrp || 0;
  const price = bestPrice || mrp;
  const discount = bestDiscount || 0;
  const platform = bestPlatform || 'Multi';
  const emoji = CATEGORY_EMOJI[category] || '📦';

  const handleClick = () => navigate(`/product/${_id}`);

  return (
    <article
      className="product-card fade-in"
      id={`product-card-${_id}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`${name} — ₹${price?.toLocaleString('en-IN')}`}
    >
      <div className="card-img-wrap">
        <div className="card-img-placeholder">{emoji}</div>
        {discount > 0 && (
          <span className="off-badge">{discount}% off</span>
        )}
        <span className="platform-badge" style={{ textTransform: 'capitalize' }}>
          {platform}
        </span>
      </div>

      <div className="card-body">
        <StarRating rating={rating} />
        <p className="card-name">{name}</p>
        <p className="card-price">
          ₹{price ? price.toLocaleString('en-IN') : '—'}
        </p>
        {mrp > 0 && price < mrp && (
          <p className="card-mrp">₹{mrp.toLocaleString('en-IN')}</p>
        )}
        <button className="buy-btn" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
          View Prices →
        </button>
      </div>
    </article>
  );
}
