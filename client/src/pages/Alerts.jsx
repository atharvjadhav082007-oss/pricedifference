import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAlerts, deleteAlert } from '../api';

export default function Alerts() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const data = await getAlerts(email);
      setAlerts(data.alerts || []);
      setSubmitted(true);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteAlert(id);
    setAlerts((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="detail-page fade-in">
          <button className="back-link" onClick={() => navigate('/')} id="alerts-back-btn">
            ← Back to Home
          </button>

          <h1 className="detail-name" style={{ marginBottom: 6 }}>🔔 My Price Alerts</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            Enter your email to view all active alerts
          </p>

          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <input
              id="alerts-email-lookup"
              className="alert-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              id="alerts-lookup-btn"
              className="alert-submit-btn"
              onClick={fetchAlerts}
              disabled={loading || !email}
            >
              {loading ? 'Loading…' : 'View Alerts'}
            </button>
          </div>

          {submitted && alerts.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔕</div>
              <h3>No alerts found</h3>
              <p>Set price alerts on product pages and they'll appear here</p>
            </div>
          )}

          {alerts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  id={`alert-item-${alert._id}`}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${alert.triggered ? 'var(--green)' : 'var(--border)'}`,
                    borderRadius: 10,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {alert.productId?.name || 'Product'}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Target: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>
                        ₹{alert.targetPrice?.toLocaleString('en-IN')}
                      </span>
                    </p>
                  </div>

                  <span style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 4,
                    background: alert.triggered ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.1)',
                    color: alert.triggered ? 'var(--green)' : 'var(--orange)',
                    border: `1px solid ${alert.triggered ? 'rgba(34,197,94,0.3)' : 'rgba(249,115,22,0.3)'}`,
                    fontWeight: 600,
                  }}>
                    {alert.triggered ? '✅ Triggered' : '⏳ Active'}
                  </span>

                  <button
                    id={`delete-alert-${alert._id}`}
                    onClick={() => handleDelete(alert._id)}
                    style={{
                      background: 'rgba(226,75,74,0.1)',
                      border: '1px solid rgba(226,75,74,0.3)',
                      color: 'var(--red)',
                      borderRadius: 6,
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
