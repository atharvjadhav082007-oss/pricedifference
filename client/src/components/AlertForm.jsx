import { useState } from 'react';
import { createAlert } from '../api';

export default function AlertForm({ productId }) {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !targetPrice) {
      setStatus('error');
      setMsg('Please enter both email and target price.');
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await createAlert({ productId, email, targetPrice: Number(targetPrice) });
      setStatus('success');
      setMsg(`✅ Alert set! We'll email ${email} when the price drops to ₹${Number(targetPrice).toLocaleString('en-IN')}.`);
      setEmail('');
      setTargetPrice('');
    } catch (err) {
      setStatus('error');
      setMsg(err?.response?.data?.error || 'Failed to set alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alert-form-card">
      <div className="alert-form-title">
        <span>🔔</span>
        <span>Price alert — get notified by email</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="alert-row">
          <input
            id="alert-email-input"
            className="alert-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Your email address"
          />
          <input
            id="alert-price-input"
            className="alert-input"
            type="number"
            placeholder="Target ₹ e.g. 24000"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            min="1"
            required
            aria-label="Target price in rupees"
          />
          <button
            id="alert-submit-btn"
            type="submit"
            className="alert-submit-btn"
            disabled={loading}
          >
            {loading ? 'Setting…' : 'Notify me'}
          </button>
        </div>
      </form>

      {msg && (
        <div className={`alert-msg ${status}`} role="alert">
          {msg}
        </div>
      )}
    </div>
  );
}
