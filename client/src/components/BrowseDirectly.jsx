import React, { useState } from 'react';

const platforms = [
  { name: 'Amazon',      bg: '#FFFFFF', textColor: '#FF9900', url: 'https://amazon.in' },
  { name: 'Flipkart',    bg: '#2874F0', textColor: '#fff',    url: 'https://flipkart.com' },
  { name: 'Myntra',      bg: '#FFFFFF', textColor: '#FF3F6C', url: 'https://myntra.com' },
  { name: 'Meesho',      bg: '#B1206E', textColor: '#fff',    url: 'https://meesho.com' },
  { name: 'Zomato',      bg: '#E23744', textColor: '#fff',    url: 'https://zomato.com' },
  { name: 'Blinkit',     bg: '#F5C842', textColor: '#1a7a1a', url: 'https://blinkit.com' },
  { name: 'Zepto',       bg: '#8B2FC9', textColor: '#fff',    url: 'https://zepto.com' },
  { name: 'Swiggy',      bg: '#FC8019', textColor: '#fff',    url: 'https://swiggy.com' },
  { name: 'Instamart',   bg: '#0066FF', textColor: '#fff',    url: 'https://swiggy.com/instamart' },
  { name: 'Ajio',        bg: '#506577', textColor: '#fff',    url: 'https://ajio.com' },
  { name: 'Nykaa',       bg: '#FC2779', textColor: '#fff',    url: 'https://nykaa.com' },
  { name: 'Croma',       bg: '#E53935', textColor: '#fff',    url: 'https://croma.com' },
  { name: 'Reliance',    bg: '#1565C0', textColor: '#fff',    url: 'https://reliancedigital.in' },
  { name: 'JioMart',     bg: '#0073E6', textColor: '#fff',    url: 'https://jiomart.com' },
  { name: 'Bigbasket',   bg: '#FFFFFF', textColor: '#84C225', url: 'https://bigbasket.com' },
  { name: 'BookMyShow',  bg: '#C8203C', textColor: '#fff',    url: 'https://bookmyshow.com' },
  { name: 'Uber',        bg: '#000000', textColor: '#fff',    url: 'https://uber.com' },
  { name: 'Ola',         bg: '#25AE60', textColor: '#fff',    url: 'https://olacabs.com' },
  { name: 'Tata Cliq',   bg: '#662D91', textColor: '#fff',    url: 'https://tatacliq.com' },
  { name: 'Snapdeal',    bg: '#E40000', textColor: '#fff',    url: 'https://snapdeal.com' },
];

const PlatformItem = ({ platform }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const domain = new URL(platform.url).hostname.replace('www.', '');
  const logoUrl = `https://logo.clearbit.com/${domain}`;
  const initials = platform.name.substring(0, 2).toUpperCase();

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', cursor: 'pointer' }}
      onClick={() => window.open(platform.url, '_blank')}
    >
      <div 
        className="platform-logo-circle"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: platform.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {!imageFailed ? (
          <img 
            src={logoUrl} 
            alt={platform.name}
            onError={() => setImageFailed(true)}
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
        ) : (
          <span style={{ fontSize: '13px', fontWeight: 600, color: platform.textColor }}>
            {initials}
          </span>
        )}
      </div>
      <span style={{ fontSize: '11px', color: '#ccc', textAlign: 'center', whiteSpace: 'nowrap' }}>
        {platform.name}
      </span>
    </div>
  );
};

export default function BrowseDirectly() {
  const [showAll, setShowAll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const displayedPlatforms = showAll ? platforms : platforms.slice(0, 12);

  return (
    <section style={{ width: '100%', padding: '20px 16px', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', color: '#fff', fontWeight: 500, margin: '0 0 4px 0' }}>Browse directly: all in one</h2>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Browse directly on top platforms without installing the app</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gridColumnGap: '8px', 
        gridRowGap: '14px',
        marginBottom: '20px'
      }}>
        {displayedPlatforms.map(p => (
          <PlatformItem key={p.name} platform={p} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => setShowAll(!showAll)}
          style={{
            flex: 1,
            backgroundColor: '#5b4fcf',
            color: '#fff',
            borderRadius: '24px',
            padding: '12px 24px',
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {showAll ? 'Show less' : 'View more'}
        </button>
        <button 
          onClick={() => setShowDemo(true)}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            color: '#fff',
            borderRadius: '24px',
            padding: '12px 24px',
            fontSize: '13px',
            border: '1.5px solid #5b4fcf',
            cursor: 'pointer'
          }}
        >
          Show Demo
        </button>
      </div>

      {showDemo && (
        <div 
          onClick={() => setShowDemo(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 200,
            padding: '16px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#161b27',
              border: '1px solid #2a2f3e',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '340px',
              margin: '100px auto 0',
              position: 'relative'
            }}
          >
            <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 500, margin: '0 0 16px 0' }}>
              How Browse Directly works
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #2a2f3e' }}>
                <span style={{ fontSize: '20px', color: '#f97316' }}>🔍</span>
                <span style={{ fontSize: '13px', color: '#ddd' }}>Search or paste any product link</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #2a2f3e' }}>
                <span style={{ fontSize: '20px', color: '#f97316' }}>➔</span>
                <span style={{ fontSize: '13px', color: '#ddd' }}>We find the same product across all platforms</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #2a2f3e' }}>
                <span style={{ fontSize: '20px', color: '#f97316' }}>✓</span>
                <span style={{ fontSize: '13px', color: '#ddd' }}>Pick the lowest price and buy directly</span>
              </div>
            </div>

            <button 
              onClick={() => setShowDemo(false)}
              style={{
                width: '100%',
                backgroundColor: '#f97316',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
}