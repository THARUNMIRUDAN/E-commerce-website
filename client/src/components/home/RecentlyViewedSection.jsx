import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import ProductCard from '../product/ProductCard.jsx';
import { recentlyViewedService } from '../../services/recentlyViewedService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const RecentlyViewedSection = () => {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await recentlyViewedService.get();
        setProducts(data || []);
      } catch (error) {
        console.error('[RecentlyViewedSection] Error:', error.message);
      }
    };

    fetchRecentlyViewed();
  }, [isAuthenticated]);

  if (!isAuthenticated || products.length === 0) return null;

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>History</span>
            </div>
            <h2 className="section-title">Recently Viewed</h2>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
