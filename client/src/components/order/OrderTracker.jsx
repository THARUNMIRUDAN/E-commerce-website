import React from 'react';
import { Check, Clock, Truck, Package, CheckCircle2, AlertOctagon } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate.js';

const steps = [
  { key: 'Pending', label: 'Ordered', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: Package },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

const OrderTracker = ({ currentStatus, statusHistory = [] }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#991b1b',
        }}
      >
        <AlertOctagon size={24} />
        <div>
          <h6 style={{ fontWeight: 700 }}>Order Cancelled</h6>
          <p style={{ fontSize: '0.85rem' }}>This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div style={{ padding: '1rem 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Background Connecting Bar */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            right: '40px',
            height: '3px',
            backgroundColor: 'var(--bg-muted)',
            zIndex: 1,
          }}
        />

        {/* Active Progress Bar */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%`,
            maxWidth: 'calc(100% - 80px)',
            height: '3px',
            backgroundColor: 'var(--emerald-500)',
            transition: 'width 0.4s ease',
            zIndex: 1,
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
                zIndex: 2,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isDone ? (isCurrent ? 'var(--primary-900)' : 'var(--emerald-500)') : 'var(--bg-surface)',
                  color: isDone ? '#ffffff' : 'var(--text-light)',
                  border: isDone ? 'none' : '2px solid var(--border-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(15, 23, 42, 0.15)' : 'var(--shadow-sm)',
                  transition: 'all var(--transition-base)',
                }}
              >
                {idx < currentIndex ? <Check size={18} /> : <StepIcon size={18} />}
              </div>

              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: isCurrent ? 800 : isDone ? 600 : 500,
                    color: isDone ? 'var(--text-main)' : 'var(--text-light)',
                    display: 'block',
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline logs */}
      {statusHistory.length > 0 && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
          <h6 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>Status Updates</h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {statusHistory.map((hist, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{hist.status}</span>
                <span>{hist.note}</span>
                <span style={{ color: 'var(--text-light)' }}>{formatDateTime(hist.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
