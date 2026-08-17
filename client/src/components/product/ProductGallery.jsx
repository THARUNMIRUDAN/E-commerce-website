import React, { useState } from 'react';

const ProductGallery = ({ images = [], productName = 'Product' }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Active Featured Image */}
      <div
        style={{
          position: 'relative',
          paddingTop: '85%',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9',
          border: '1px solid var(--border-main)',
        }}
      >
        <img
          src={displayImages[activeIndex]}
          alt={`${productName} view ${activeIndex + 1}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.25s ease',
          }}
        />
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid',
                borderColor: activeIndex === idx ? 'var(--primary-900)' : 'var(--border-main)',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
                backgroundColor: '#f8fafc',
                opacity: activeIndex === idx ? 1 : 0.65,
                transition: 'all var(--transition-fast)',
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
