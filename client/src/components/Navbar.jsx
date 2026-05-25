import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSavedItems } from '../context/SavedItemsContext';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const timer = useRef(null);
  const { wishlist, favorites, openDrawer } = useSavedItems();

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (onSearch) onSearch(val);
      navigate(val ? `/?search=${encodeURIComponent(val)}` : '/');
    }, 350);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span>Price</span>Radar
      </Link>

      <div className="navbar-search">
        {/* Search icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          id="navbar-search-input"
          type="text"
          placeholder="Search products across all platforms…"
          value={query}
          onChange={handleChange}
          aria-label="Search products"
        />
      </div>

      <div className="navbar-actions">
        {/* Wishlist Button */}
        <button 
          className="icon-btn action-badge-btn" 
          onClick={() => openDrawer('wishlist')} 
          title="Wishlist"
          aria-label="Wishlist"
          style={{ position: 'relative' }}
        >
          <span style={{ fontSize: '16px', color: wishlist.length > 0 ? 'var(--red)' : 'inherit' }}>♥</span>
          {wishlist.length > 0 && <span className="count-badge pink">{wishlist.length}</span>}
        </button>

        {/* Favorites Button */}
        <button 
          className="icon-btn action-badge-btn" 
          onClick={() => openDrawer('favorites')} 
          title="Favorites"
          aria-label="Favorites"
          style={{ position: 'relative' }}
        >
          <span style={{ fontSize: '16px', color: favorites.length > 0 ? '#eab308' : 'inherit' }}>★</span>
          {favorites.length > 0 && <span className="count-badge gold">{favorites.length}</span>}
        </button>

        <Link to="/alerts" id="alerts-bell-btn" title="My Alerts">
          <button className="icon-btn" aria-label="Price alerts">
            {/* Bell icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </Link>

        {/* Profile Link Button */}
        <Link to="/profile" id="navbar-profile-btn" title="My Profile">
          <button className="icon-btn" aria-label="My Profile">
            {/* User icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </Link>
      </div>
    </nav>
  );
}
