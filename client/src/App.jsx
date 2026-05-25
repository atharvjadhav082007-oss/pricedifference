import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Compare from './pages/Compare';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Deals from './pages/Deals';
import { SavedItemsProvider } from './context/SavedItemsContext';
import SavedItemsDrawer from './components/SavedItemsDrawer';

export default function App() {
  return (
    <SavedItemsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/compare/:id" element={<Compare />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#888' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h2 style={{ color: '#e8e8e8', marginBottom: 8 }}>Page not found</h2>
              <a href="/" style={{ color: '#f97316' }}>← Back to Home</a>
            </div>
          } />
        </Routes>
        <SavedItemsDrawer />
      </BrowserRouter>
    </SavedItemsProvider>
  );
}
