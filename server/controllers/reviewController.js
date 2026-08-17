import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get reviews & rating distribution for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    reviews.forEach((rev) => {
      const star = Math.min(5, Math.max(1, Math.round(rev.rating)));
      distribution[star] = (distribution[star] || 0) + 1;
      totalScore += rev.rating;
    });

    const averageRating = reviews.length > 0 ? (totalScore / reviews.length).toFixed(1) : 0;

    res.json({
      reviews,
      totalReviews: reviews.length,
      averageRating: Number(averageRating),
      distribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if current user can review this product
// @route   GET /api/reviews/product/:productId/eligibility
// @access  Private
export const checkReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.json({
        canReview: false,
        hasReviewed: true,
        review: existingReview,
        reason: 'You have already reviewed this product',
      });
    }

    // Check if user purchased this product in any non-cancelled order
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      orderStatus: { $ne: 'Cancelled' },
      'orderItems.product': productId,
    });

    if (!hasPurchased) {
      return res.json({
        canReview: false,
        hasReviewed: false,
        reason: 'Only verified buyers who have ordered this product can write a review.',
      });
    }

    res.json({
      canReview: true,
      hasReviewed: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product review
// @route   POST /api/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'Rating and review comment are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 1. Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already submitted a review for this product' });
    }

    // 2. Check if user has purchased this product
    const verifiedPurchase = await Order.findOne({
      user: req.user._id,
      orderStatus: { $ne: 'Cancelled' },
      'orderItems.product': productId,
    });

    if (!verifiedPurchase) {
      return res.status(403).json({
        message: 'Only verified buyers who have ordered this product are eligible to post a review.',
      });
    }

    // 3. Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    // 4. Update Product aggregate rating
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    await product.save();

    res.status(201).json({
      message: 'Review added successfully',
      review,
      productRating: product.rating,
      productNumReviews: product.numReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
