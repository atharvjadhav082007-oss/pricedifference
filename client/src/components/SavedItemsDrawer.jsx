import { useSavedItems } from '../context/SavedItemsContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function SavedItemsDrawer() {
  const {
    wishlist,
    favorites,
    isDrawerOpen,
    drawerTab,
    setDrawerTab,
    closeDrawer,
    removeFromWishlist,
    removeFromFavorite,
  } = useSavedItems();

  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const currentItems = drawerTab === 'wishlist' ? wishlist : favorites;
  const isWishlist = drawerTab === 'wishlist';

  const handleItemClick = (id) => {
    navigate(`/product/${id}`);
    closeDrawer();
  };

  return (
    <div className="drawer-overlay" onClick={closeDrawer}>
      <div 
        className="drawer-panel fade-in-right" 
        onClick={(e) => e.stopPropagation()}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Saved Items Drawer"
      >
        {/* Header */}
        <div className="drawer-header">
          <h2>Saved Items</h2>
          <button className="drawer-close-btn" onClick={closeDrawer} aria-label="Close drawer">
            &times;
          </button>
        </div>

        {/* Tab Selection */}
        <div className="drawer-tabs">
          <button
            className={`drawer-tab-btn ${isWishlist ? 'active' : ''}`}
            onClick={() => setDrawerTab('wishlist')}
          >
            <span>♥ Wishlist</span>
            <span className="tab-badge">{wishlist.length}</span>
          </button>
          <button
            className={`drawer-tab-btn ${!isWishlist ? 'active' : ''}`}
            onClick={() => setDrawerTab('favorites')}
          >
            <span>★ Favorites</span>
            <span className="tab-badge">{favorites.length}</span>
          </button>
        </div>

        {/* List Content */}
        <div className="drawer-content">
          {currentItems.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="drawer-empty-icon">{isWishlist ? '💔' : '⭐'}</div>
              <h3>No items saved</h3>
              <p>Your {isWishlist ? 'wishlist' : 'favorites'} is currently empty.</p>
              <button className="drawer-browse-btn" onClick={closeDrawer}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {currentItems.map((item) => {
                const categoryEmoji = {
                  electronics: '💻',
                  fashion: '👕',
                  shoes: '👟',
                  beauty: '💄',
                  appliances: '🏠',
                }[item.category] || '📦';

                const price = item.bestPrice || item.specs?.mrp || 0;

                return (
                  <div key={item._id} className="drawer-item-card" onClick={() => handleItemClick(item._id)}>
                    <div className="drawer-item-emoji">{categoryEmoji}</div>
                    <div className="drawer-item-details">
                      <h4 className="drawer-item-name">{item.name}</h4>
                      <div className="drawer-item-meta">
                        <span className="drawer-item-price">₹{price.toLocaleString('en-IN')}</span>
                        {item.bestPlatform && (
                          <span className="drawer-item-platform">{item.bestPlatform}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="drawer-item-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isWishlist) {
                          removeFromWishlist(item._id);
                        } else {
                          removeFromFavorite(item._id);
                        }
                      }}
                      aria-label="Remove item"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
