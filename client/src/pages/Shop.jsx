import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard.jsx';
import ProductFilter from '../components/product/ProductFilter.jsx';
import ProductSort from '../components/product/ProductSort.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Loader from '../components/common/Loader.jsx';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { SlidersHorizontal, PackageSearch } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = Number(searchParams.get('page')) || 1;

  // Local filter states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(50000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Pagination & metrics
  const [page, setPage] = useState(pageParam);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAll();
        setCategories(cats || []);
      } catch (err) {
        console.error('[Shop] Error loading categories:', err.message);
      }
    };
    loadCategories();
  }, []);

  // Fetch Products whenever filters / search params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          keyword: keywordParam,
          category: categoryParam !== 'all' ? categoryParam : '',
          brand: selectedBrands.join(','),
          maxPrice: priceRange < 50000 ? priceRange : '',
          rating: selectedRating > 0 ? selectedRating : '',
          inStock: inStockOnly ? 'true' : '',
          sort: sortParam,
          page: page,
          limit: 12,
        };

        const data = await productService.getAll(params);
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
        if (data.brands) {
          setBrands(data.brands);
        }
      } catch (error) {
        console.error('[Shop] Error fetching products:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keywordParam, categoryParam, sortParam, page, selectedBrands, priceRange, selectedRating, inStockOnly]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
    setPage(1);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) => {
      const next = prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand];
      setPage(1);
      return next;
    });
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setPriceRange(50000);
    setSelectedRating(0);
    setInStockOnly(false);
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
            {keywordParam
              ? `Search Results for "${keywordParam}"`
              : categoryParam !== 'all'
              ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Collection`
              : 'Explore All Products'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Discover top-tier brands and modern everyday essentials.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div style={{ display: 'none', marginBottom: '1rem' }} className="mobile-filter-btn">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
          >
            <SlidersHorizontal size={16} />
            {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '2rem',
            alignItems: 'flex-start',
          }}
          className="shop-layout"
        >
          {/* Filter Sidebar */}
          <aside className={`shop-sidebar ${mobileFilterOpen ? 'mobile-show' : ''}`}>
            <ProductFilter
              categories={categories}
              brands={brands}
              selectedCategory={categoryParam}
              selectedBrand={selectedBrands}
              priceRange={priceRange}
              selectedRating={selectedRating}
              inStockOnly={inStockOnly}
              onCategoryChange={(cat) => updateParam('category', cat)}
              onBrandChange={handleBrandChange}
              onPriceChange={(val) => {
                setPriceRange(val);
                setPage(1);
              }}
              onRatingChange={(val) => {
                setSelectedRating(val);
                setPage(1);
              }}
              onStockToggle={(val) => {
                setInStockOnly(val);
                setPage(1);
              }}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Product Results Section */}
          <section>
            <ProductSort
              currentSort={sortParam}
              totalProducts={totalProducts}
              onSortChange={(sort) => updateParam('sort', sort)}
            />

            {loading ? (
              <Loader message="Fetching catalog..." />
            ) : products.length === 0 ? (
              <div
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px dashed var(--border-main)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <PackageSearch size={48} color="var(--text-light)" />
                <h3 style={{ fontWeight: 700 }}>No Products Match Your Criteria</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
                  Try relaxing some of your filters, searching for a different term, or browsing other categories.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <Pagination
                  page={page}
                  pages={pages}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', String(newPage));
                    setSearchParams(newParams);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </section>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: block !important;
          }
          .shop-sidebar {
            display: none;
          }
          .shop-sidebar.mobile-show {
            display: block;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;
