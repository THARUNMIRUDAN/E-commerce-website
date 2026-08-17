import React from 'react';
import { ShieldCheck, User } from 'lucide-react';
import RatingStars from '../common/RatingStars.jsx';
import { formatDate } from '../../utils/formatDate.js';

const ReviewList = ({ reviews = [], averageRating = 0, totalReviews = 0, distribution = {} }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Aggregate Rating Breakdown Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          padding: '2rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-xl)',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--primary-900)',
              lineHeight: 1,
              display: 'block',
            }}
          >
            {averageRating.toFixed(1)}
          </span>
          <div style={{ margin: '0.5rem 0' }}>
            <RatingStars rating={averageRating} size={20} showCount={false} />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Based on {totalReviews} verified ratings
          </p>
        </div>

        {/* Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div
                key={star}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ width: '35px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {star} ★
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: '#f59e0b',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  />
                </div>
                <span style={{ width: '25px', textAlign: 'right', color: 'var(--text-muted)' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Review Comments */}
      {reviews.length === 0 ? (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-main)',
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No customer reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-main)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      fontWeight: 700,
                    }}
                  >
                    {review.name?.charAt(0) || <User size={16} />}
                  </div>
                  <div>
                    <h6 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{review.name}</h6>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#047857',
                        fontWeight: 600,
                      }}
                    >
                      <ShieldCheck size={13} /> Verified Purchase
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                  <RatingStars rating={review.rating} size={14} showCount={false} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
