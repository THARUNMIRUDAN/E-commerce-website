import React from 'react';

const AddressForm = ({ address, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...address,
      [name]: value,
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '1.75rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-main)',
      }}
    >
      <h4 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>1. Shipping Address</h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={address.fullName || ''}
            onChange={handleChange}
            placeholder="e.g. Tharun Kumar"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={address.phone || ''}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="address">Street Address / Apartment / Suite</label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={address.address || ''}
          onChange={handleChange}
          placeholder="Flat No, Building, Street name"
          className="form-input"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={address.city || ''}
            onChange={handleChange}
            placeholder="e.g. Bengaluru"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            type="text"
            required
            value={address.state || ''}
            onChange={handleChange}
            placeholder="e.g. Karnataka"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="postalCode">Postal / ZIP Code</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            required
            value={address.postalCode || ''}
            onChange={handleChange}
            placeholder="e.g. 560001"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
