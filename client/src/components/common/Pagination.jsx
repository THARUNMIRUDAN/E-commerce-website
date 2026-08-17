import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '3rem',
      }}
    >
      <button
        className="btn btn-outline btn-icon-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            borderColor: num === page ? 'var(--primary-900)' : 'var(--border-main)',
            backgroundColor: num === page ? 'var(--primary-900)' : 'var(--bg-surface)',
            color: num === page ? '#ffffff' : 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          {num}
        </button>
      ))}

      <button
        className="btn btn-outline btn-icon-sm"
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
