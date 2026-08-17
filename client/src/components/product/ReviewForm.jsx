import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, AlertCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [eligibility, setEligibility] = useState({ canReview: false, checked: false, reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const checkEligibility = async () => {
      if (!isAuthenticated || !productId) {
        setEligibility({ canReview: false, checked: true, reason: 'Sign in to write a review' });
        return;
      }
      try {
        const res = await reviewService.checkEligibility(productId);
        setEligibility({ ...res, checked: true });
      } catch (err) {
        setEligibility({ canReview: false, checked: true, reason: err.message });
      }
    };

    checkEligibility();
  }, [isAuthenticated, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please enter your review comments', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.create({
        productId,
        rating,
        comment: comment.trim(),
      });
      showToast('Your verified review has been posted!', 'success');
      setComment('');
      setEligibility({ canReview: false, checked: true, hasReviewed: true });
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!eligibility.checked) return null;

  if (!isAuthenticated) {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>
          Have you purchased this product?
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Please sign in to your verified account to leave a customer review.
        </p>
      </div>
    );
  }

  if (!eligibility.canReview) {
    return (
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
        }}
      >
        {eligibility.hasReviewed ? (
          <>
            <ShieldCheck size={20} color="var(--emerald-500)" />
            <span>Thank you! You have already shared your verified feedback on this product.</span>
          </>
        ) : (
          <>
            <AlertCircle size={20} color="var(--amber-500)" />
            <span>{eligibility.reason || 'Only verified buyers who ordered this item can leave a review.'}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={18} color="var(--emerald-500)" />
        <h5 style={{ fontWeight: 700 }}>Write a Verified Review</h5>
      </div>

      {/* Star Selector */}
      <div>
        <label className="form-label" style={{ marginBottom: '0.35rem', display: 'block' }}>
          Overall Rating
        </label>
        <div style={{ display: 'flex', gap: '0.35rem', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
              }}
              aria-label={`Rate ${star} star`}
            >
              <Star
                size={26}
                fill={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="review-comment">
          Your Experience
        </label>
        <textarea
          id="review-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe build quality, real-world performance, fit or feel..."
          className="form-textarea"
          required
        />
      </div>

      <button type="submit" disabled={submitting} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        {submitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
