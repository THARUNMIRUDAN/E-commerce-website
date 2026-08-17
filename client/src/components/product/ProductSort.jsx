import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const ProductSort = ({ currentSort, totalProducts, onSortChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-main)',
      }}
    >
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Showing <strong style={{ color: 'var(--text-main)' }}>{totalProducts}</strong> products
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowUpDown size={15} color="var(--text-muted)" />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Sort by:
        </span>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="form-select"
          style={{
            padding: '0.4rem 0.8rem',
            fontSize: '0.875rem',
            width: 'auto',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          <option value="newest">Newest Arrivals</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSort;
