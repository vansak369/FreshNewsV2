import React from 'react';

export default function CategoryPills({ categories, active, onSelect }) {
  return (
    <div className="pill-row">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`pill${active === cat ? ' active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
