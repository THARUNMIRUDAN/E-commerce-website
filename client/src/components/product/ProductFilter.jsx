import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import RatingStars from '../common/RatingStars.jsx';

const ProductFilter = ({
  categories = [],
  brands = [],
  selectedCategory,
  selectedBrand,
  priceRange,
  selectedRating,
  inStockOnly,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  onStockToggle,
  onReset,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <Filter size={18} color="var(--primary-900)" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-600)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h6 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Categories</h6>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => onCategoryChange('all')}
            style={{
              textAlign: 'left',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: selectedCategory === 'all' || !selectedCategory ? 'var(--bg-subtle)' : 'transparent',
              color: selectedCategory === 'all' || !selectedCategory ? 'var(--accent-600)' : 'var(--text-secondary)',
              fontWeight: selectedCategory === 'all' || !selectedCategory ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat.slug)}
              style={{
                textAlign: 'left',
                padding: '0.4rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: selectedCategory === cat.slug ? 'var(--bg-subtle)' : 'transparent',
                color: selectedCategory === cat.slug ? 'var(--accent-600)' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat.slug ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{cat.name}</span>
              {cat.productCount !== undefined && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  {cat.productCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h6 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Max Price: ₹{priceRange.toLocaleString()}</h6>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--primary-900)',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.35rem',
          }}
        >
          <span>₹1,000</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h6 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Brands</h6>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '160px',
              overflowY: 'auto',
            }}
          >
            {brands.map((brand) => (
              <label
                key={brand}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedBrand.includes(brand)}
                  onChange={() => onBrandChange(brand)}
                  style={{ accentColor: 'var(--primary-900)' }}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Customer Rating */}
      <div>
        <h6 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Rating</h6>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(selectedRating === stars ? 0 : stars)}
              style={{
                textAlign: 'left',
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: selectedRating === stars ? 'var(--bg-subtle)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <RatingStars rating={stars} size={14} showCount={false} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <div>
        <h6 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Availability</h6>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockToggle(e.target.checked)}
            style={{ accentColor: 'var(--primary-900)' }}
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilter;
