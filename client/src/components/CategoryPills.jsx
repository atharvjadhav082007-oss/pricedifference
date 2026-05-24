const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'electronics', label: '💻 Electronics' },
  { id: 'fashion', label: '👕 Fashion' },
  { id: 'shoes', label: '👟 Shoes' },
  { id: 'beauty', label: '💄 Beauty' },
  { id: 'appliances', label: '🏠 Appliances' },
];

export default function CategoryPills({ active, onChange }) {
  return (
    <div className="category-pills" role="tablist" aria-label="Product categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          id={`cat-pill-${cat.id}`}
          role="tab"
          aria-selected={active === cat.id}
          className={`pill ${active === cat.id ? 'active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
