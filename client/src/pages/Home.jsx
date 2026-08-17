import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/home/HeroBanner.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import FeaturedSection from '../components/home/FeaturedSection.jsx';
import LimitedOffers from '../components/home/LimitedOffers.jsx';
import RecentlyViewedSection from '../components/home/RecentlyViewedSection.jsx';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import Loader from '../components/common/Loader.jsx';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [feat, trend, cats] = await Promise.all([
          productService.getFeatured(),
          productService.getTrending(),
          categoryService.getAll(),
        ]);
        setFeaturedProducts(feat || []);
        setTrendingProducts(trend || []);
        setCategories(cats || []);
      } catch (error) {
        console.error('[Home] Error loading homepage feeds:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return <Loader message="Loading products..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
      <div className="container">
        <HeroBanner />
      </div>

      <CategoryShowcase categories={categories} />

      <FeaturedSection
        products={featuredProducts}
        title="Featured Products"
        subtitle="Top picks and customer favorites"
      />

      <LimitedOffers />

      <FeaturedSection
        products={trendingProducts}
        title="Trending Now"
        subtitle="Popular items loved by our shoppers"
      />

      <RecentlyViewedSection />
    </div>
  );
};

export default Home;
