import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary-900)', bg = 'var(--bg-subtle)', change = '' }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {title}
        </span>
        <h3
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginTop: '0.25rem',
            marginBottom: '0.2rem',
          }}
        >
          {value}
        </h3>
        {change && (
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald-500)', fontWeight: 600 }}>
            {change}
          </span>
        )}
      </div>

      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
