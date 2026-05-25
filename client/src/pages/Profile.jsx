import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { useSavedItems } from '../context/SavedItemsContext';

export default function Profile() {
  const navigate = useNavigate();
  const { wishlist, favorites, openDrawer } = useSavedItems();

  const [name, setName] = useState(() => {
    return localStorage.getItem('priceradar_profile_name') || '';
  });

  const [password, setPassword] = useState(() => {
    return localStorage.getItem('priceradar_profile_password') || '';
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate premium micro-animation loading
    setTimeout(() => {
      localStorage.setItem('priceradar_profile_name', name.trim());
      localStorage.setItem('priceradar_profile_password', password);
      
      setToast({
        message: 'Profile updated successfully!',
        type: 'success',
      });
      setIsSaving(false);
    }, 750);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your profile information?')) {
      localStorage.removeItem('priceradar_profile_name');
      localStorage.removeItem('priceradar_profile_password');
      setName('');
      setPassword('');
      setToast({
        message: 'Profile information reset.',
        type: 'info',
      });
    }
  };

  // Get initials for profile avatar
  const getInitials = () => {
    const trimmed = name.trim();
    if (!trimmed) return 'G'; // Guest
    const parts = trimmed.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed[0].toUpperCase();
  };

  const displayName = name.trim() || 'Guest User';

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="profile-container fade-in">
          {/* Back button */}
          <button className="back-link" onClick={() => navigate(-1)} id="profile-back-btn">
            ← Back
          </button>

          {/* Toast Alert */}
          {toast && (
            <div className={`profile-toast ${toast.type}`}>
              {toast.message}
            </div>
          )}

          {/* Header Card */}
          <div className="profile-header-card">
            <div className="profile-avatar-circle">
              {getInitials()}
            </div>
            <div className="profile-header-info">
              <h2>{displayName}</h2>
              <span className="profile-tag">Local Account</span>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="profile-card">
            <h3>👤 Profile Settings</h3>
            <p className="profile-sub">Customize your display name and password.</p>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="profile-name-input">Display Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    id="profile-name-input"
                    type="text"
                    placeholder="Enter your name…"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="profile-password-input">Account Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔑</span>
                  <input
                    id="profile-password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password…"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="profile-btn-row">
                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="spinner"></span>
                  ) : (
                    'Save Settings'
                  )}
                </button>
                <button
                  type="button"
                  className="profile-reset-btn"
                  onClick={handleReset}
                >
                  Reset Info
                </button>
              </div>
            </form>
          </div>

          {/* Stats Dashboard */}
          <div className="profile-stats-card">
            <h3>📊 Saved Dashboard Activity</h3>
            <div className="profile-stats-grid">
              <div 
                className="profile-stat-box" 
                onClick={() => openDrawer('wishlist')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openDrawer('wishlist')}
                aria-label={`Wishlist: ${wishlist.length} items`}
              >
                <span className="stat-icon pink">♥</span>
                <div className="stat-number">{wishlist.length}</div>
                <div className="stat-label">Wishlisted Items</div>
              </div>

              <div 
                className="profile-stat-box" 
                onClick={() => openDrawer('favorites')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openDrawer('favorites')}
                aria-label={`Favorites: ${favorites.length} items`}
              >
                <span className="stat-icon gold">★</span>
                <div className="stat-number">{favorites.length}</div>
                <div className="stat-label">Highlighted Favorites</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <BottomNav />
    </>
  );
}
