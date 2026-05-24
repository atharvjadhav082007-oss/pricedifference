import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getHistory } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const PLATFORM_COLORS = {
  amazon:     '#FF9900',
  flipkart:   '#2874F0',
  croma:      '#E53935',
  reliance:   '#1565C0',
  vijaysales: '#7B1FA2',
  meesho:     '#F43397',
  ajio:       '#E91E63',
  myntra:     '#FF3F6C',
  nykaa:      '#FC2779',
};

const RANGES = ['7D', '30D', '60D', '1Y'];

function buildChartData(history, allDates) {
  const byPlatform = {};
  history.forEach(({ date, platform, price }) => {
    if (!byPlatform[platform]) byPlatform[platform] = {};
    byPlatform[platform][date] = price;
  });

  const datasets = Object.entries(byPlatform).map(([platform, dateMap]) => {
    const color = PLATFORM_COLORS[platform] || '#888';
    return {
      label: platform,
      data: allDates.map((d) => dateMap[d] ?? null),
      borderColor: color,
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.4,
      spanGaps: true,
    };
  });

  return { labels: allDates, datasets };
}

export default function PriceHistoryChart({ productId }) {
  const [range, setRange] = useState('30D');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getHistory(productId, range)
      .then((data) => setHistory(data.history || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [productId, range]);

  // Get all unique dates in order
  const allDates = [...new Set(history.map((h) => h.date))].sort();
  // Get all platforms
  const platforms = [...new Set(history.map((h) => h.platform))];

  const chartData = buildChartData(history, allDates);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e2333',
        titleColor: '#fff',
        bodyColor: '#aaa',
        borderColor: '#2a2f3e',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (items) => items[0]?.label || '',
          label: (item) =>
            `  ${item.dataset.label}: ₹${Number(item.raw).toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#1e2333', drawBorder: false },
        ticks: {
          color: '#444',
          font: { size: 10 },
          maxTicksLimit: 8,
          maxRotation: 0,
        },
      },
      y: {
        grid: { color: '#1e2333', drawBorder: false },
        ticks: {
          color: '#444',
          font: { size: 10 },
          callback: (v) => `₹${Number(v).toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-title">📈 Price history</span>
        <div className="range-btns">
          {RANGES.map((r) => (
            <button
              key={r}
              id={`range-btn-${r}`}
              className={`range-btn ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrap">
        {loading ? (
          <div className="skeleton" style={{ height: '100%', borderRadius: 8 }} />
        ) : history.length === 0 ? (
          <p style={{ color: 'var(--text-hint)', textAlign: 'center', paddingTop: 60, fontSize: 13 }}>
            No history data available
          </p>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

      {/* Custom legend */}
      {platforms.length > 0 && (
        <div className="chart-legend">
          {platforms.map((p) => (
            <div key={p} className="legend-item">
              <div className="legend-dash" style={{ background: PLATFORM_COLORS[p] || '#888' }} />
              <span style={{ textTransform: 'capitalize' }}>{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
