import React from 'react';

const Loader = ({ size = 'md', fullScreen = false, message = '' }) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 56,
  };

  const dimension = sizeMap[size] || 40;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: dimension,
          height: dimension,
          border: '3px solid #e2e8f0',
          borderTopColor: 'var(--primary-900)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      {message && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
