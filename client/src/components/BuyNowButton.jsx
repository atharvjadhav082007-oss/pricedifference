export default function BuyNowButton({ url, label = 'Buy Now →', platform }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id={`buy-now-btn-${platform || 'default'}`}
      style={{
        display: 'inline-block',
        background: 'var(--orange)',
        color: '#fff',
        fontWeight: 600,
        fontSize: 13,
        padding: '10px 22px',
        borderRadius: 'var(--radius-sm)',
        textDecoration: 'none',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={(e) => (e.target.style.background = '#ea6b0e')}
      onMouseLeave={(e) => (e.target.style.background = 'var(--orange)')}
    >
      {label}
    </a>
  );
}
