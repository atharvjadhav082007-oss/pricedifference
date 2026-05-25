import { createContext, useContext, useState, useEffect } from 'react';

const SavedItemsContext = createContext();

export function SavedItemsProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('priceradar_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('priceradar_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('wishlist'); // 'wishlist' | 'favorites'

  useEffect(() => {
    localStorage.setItem('priceradar_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('priceradar_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id) => wishlist.some((p) => p._id === id);
  const isInFavorite = (id) => favorites.some((p) => p._id === id);

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((p) => p._id !== id));
  };

  const removeFromFavorite = (id) => {
    setFavorites((prev) => prev.filter((p) => p._id !== id));
  };

  const openDrawer = (tab = 'wishlist') => {
    setDrawerTab(tab);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <SavedItemsContext.Provider
      value={{
        wishlist,
        favorites,
        isDrawerOpen,
        drawerTab,
        setDrawerTab,
        toggleWishlist,
        toggleFavorite,
        isInWishlist,
        isInFavorite,
        removeFromWishlist,
        removeFromFavorite,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
}
