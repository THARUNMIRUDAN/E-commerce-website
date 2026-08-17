import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ArrowLeft,
} from 'lucide-react';
import ProductGallery from '../components/product/ProductGallery.jsx';
import RatingStars from '../components/common/RatingStars.jsx';
import ReviewList from '../components/product/ReviewList.jsx';
import ReviewForm from '../components/product/ReviewForm.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { productService } from '../services/productService.js';
import { reviewService } from '../services/reviewService.js';
import { recentlyViewedService } from '../services/recentlyViewedService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], totalReviews: 0, averageRating: 0, distribution: {} });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const loadProductData = useCallback(async () => {
    try {
      setLoading(true);
      const [prod, revs, rel] = await Promise.all([
        productService.getById(id),
        reviewService.getByProduct(id),
        productService.getRelated(id),
      ]);

      setProduct(prod);
      setReviewsData(revs || { reviews: [], totalReviews: 0, averageRating: 0, distribution: {} });
      setRelatedProducts(rel || []);

      // Record recently viewed if authenticated
      if (isAuthenticated) {
        recentlyViewedService.record(id).catch(() => {});
      }
    } catch (error) {
      console.error('[ProductDetail] Error:', error.message);
      showToast('Could not load product details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, showToast]);

  useEffect(() => {
    loadProductData();
    window.scrollTo(0, 0);
  }, [loadProductData]);

  if (loading) {
    return <Loader fullScreen message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          The product you are looking for does not exist or has been removed.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (product.stock < 1) return;
    setIsAdding(true);
    await addToCart(product._id, quantity);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleBuyNow = async () => {
    if (product.stock < 1) return;
    const added = await addToCart(product._id, quantity);
    if (added) {
      navigate('/checkout');
    }
  };

  return (
    <div className="section" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Breadcrumb / Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Product Top Grid: Gallery + Purchasing Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'flex-start',
            marginBottom: '4rem',
          }}
        >
          {/* Gallery Component */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--accent-600)',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '0.35rem',
                }}
              >
                {product.brand}
              </span>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.25 }}>
                {product.name}
              </h1>

              {/* Rating & Stock row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  marginTop: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <a href="#reviews-section" style={{ textDecoration: 'none' }}>
                  <RatingStars rating={product.rating} numReviews={product.numReviews} size={16} />
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: product.stock > 0 ? 'var(--emerald-500)' : 'var(--rose-500)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: product.stock > 0 ? '#047857' : '#be123c',
                    }}
                  >
                    {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                padding: '1.25rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <span
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--primary-900)',
                }}
              >
                {formatCurrency(activePrice)}
              </span>

              {hasDiscount && (
                <>
                  <span
                    style={{
                      fontSize: '1.15rem',
                      color: 'var(--text-light)',
                      textDecoration: 'line-through',
                    }}
                  >
                    {formatCurrency(product.price)}
                  </span>
                  <span className="badge badge-accent">Save {discountPercent}%</span>
                </>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Quantity:
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--border-main)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || product.stock === 0}
                    style={{
                      padding: '0.5rem 0.85rem',
                      background: 'none',
                      border: 'none',
                      cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                      opacity: quantity <= 1 ? 0.4 : 1,
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 0.85rem', fontWeight: 700, fontSize: '1rem', minWidth: '32px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || product.stock === 0}
                    style={{
                      padding: '0.5rem 0.85rem',
                      background: 'none',
                      border: 'none',
                      cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                      opacity: quantity >= product.stock ? 0.4 : 1,
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  className={`btn ${isAdding ? 'btn-primary' : 'btn-primary'} btn-lg`}
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  {isAdding ? (
                    <>
                      <Check size={20} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn btn-accent btn-lg"
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  <Zap size={20} /> Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn btn-outline btn-lg btn-icon"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    borderColor: inWishlist ? 'var(--accent-600)' : 'var(--border-strong)',
                  }}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  aria-label="Wishlist"
                >
                  <Heart
                    size={22}
                    color={inWishlist ? 'var(--accent-600)' : 'var(--text-secondary)'}
                    fill={inWishlist ? 'var(--accent-600)' : 'transparent'}
                  />
                </button>
              </div>
            </div>

            {/* ReVibe Assurances */}
            <div
              style={{
                borderTop: '1px solid var(--border-main)',
                paddingTop: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <Truck size={18} color="var(--primary-900)" />
                <span>Free Express Shipping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <ShieldCheck size={18} color="var(--emerald-500)" />
                <span>100% Authentic Brand</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <RotateCcw size={18} color="var(--accent-600)" />
                <span>30-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Description vs Specifications) */}
        <div style={{ borderBottom: '1.5px solid var(--border-main)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '0.75rem 0',
                background: 'none',
                border: 'none',
                borderBottom: '3px solid',
                borderColor: activeTab === 'description' ? 'var(--primary-900)' : 'transparent',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: activeTab === 'description' ? 'var(--primary-900)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              style={{
                padding: '0.75rem 0',
                background: 'none',
                border: 'none',
                borderBottom: '3px solid',
                borderColor: activeTab === 'specifications' ? 'var(--primary-900)' : 'transparent',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: activeTab === 'specifications' ? 'var(--primary-900)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Specifications & Details
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ marginBottom: '4.5rem', maxWidth: '850px' }}>
          {activeTab === 'description' ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              <p>{product.description}</p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-main)',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.925rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, width: '35%', color: 'var(--text-muted)' }}>Brand</td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-main)', fontWeight: 600 }}>{product.brand}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category</td>
                    <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-main)' }}>{product.category?.name || 'Lifestyle'}</td>
                  </tr>
                  {product.specifications &&
                    product.specifications.map((spec, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>{spec.key}</td>
                        <td style={{ padding: '0.9rem 1.25rem', color: 'var(--text-main)' }}>{spec.value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews-section" style={{ marginBottom: '5rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Customer Feedback & Reviews</h2>
              <p className="section-subtitle">Real experiences from verified purchasers</p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Reviews List & Distribution */}
            <ReviewList
              reviews={reviewsData.reviews}
              averageRating={reviewsData.averageRating}
              totalReviews={reviewsData.totalReviews}
              distribution={reviewsData.distribution}
            />

            {/* Write a Review Card */}
            <ReviewForm productId={product._id} onReviewAdded={loadProductData} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">You Might Also Like</h2>
                <p className="section-subtitle">Similar items curated from the same collection</p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd._id} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
