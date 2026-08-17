import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, numReviews, size = 16, showCount = true }) => {
  const roundedRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1" style={{ display: 'inline-flex' }}>
      <div className="flex items-center" style={{ color: '#f59e0b' }}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = Math.max(
            0,
            Math.min(100, (roundedRating - (starIndex - 1)) * 100)
          );

          return (
            <span key={starIndex} style={{ position: 'relative', display: 'inline-block' }}>
              <Star size={size} strokeWidth={1.5} color="#cbd5e1" fill="#cbd5e1" />
              {fillPercentage > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${fillPercentage}%`,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Star size={size} strokeWidth={1.5} color="#f59e0b" fill="#f59e0b" />
                </span>
              )}
            </span>
          );
        })}
      </div>

      <span
        style={{
          fontSize: size <= 14 ? '0.75rem' : '0.85rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          marginLeft: '4px',
        }}
      >
        {roundedRating.toFixed(1)}
      </span>

      {showCount && numReviews !== undefined && (
        <span
          style={{
            fontSize: size <= 14 ? '0.75rem' : '0.85rem',
            color: 'var(--text-muted)',
            marginLeft: '2px',
          }}
        >
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
