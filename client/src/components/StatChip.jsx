export default function StatChip({ label, value, color = 'white' }) {
  return (
    <div className="stat-chip">
      <div className="stat-chip-label">{label}</div>
      <div className={`stat-chip-value ${color}`}>{value ?? '—'}</div>
    </div>
  );
}
