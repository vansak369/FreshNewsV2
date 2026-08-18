import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search stories…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search stories"
      />
      <button type="submit" className="btn btn-sm">Search</button>
    </form>
  );
}
