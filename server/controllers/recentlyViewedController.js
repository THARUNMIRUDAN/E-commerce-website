import RecentlyViewed from '../models/RecentlyViewed.js';
import Product from '../models/Product.js';

// @desc    Get recently viewed products for user
// @route   GET /api/recently-viewed
// @access  Private
export const getRecentlyViewed = async (req, res) => {
  try {
    const list = await RecentlyViewed.find({ user: req.user._id })
      .sort({ viewedAt: -1 })
      .limit(8)
      .populate({
        path: 'product',
        match: { isArchived: { $ne: true } },
        populate: { path: 'category', select: 'name slug' },
      });

    // Filter out null products (in case any were archived or deleted)
    const validProducts = list
      .filter((item) => item.product !== null)
      .map((item) => item.product);

    res.json(validProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record or update recently viewed product
// @route   POST /api/recently-viewed
// @access  Private
export const recordRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || product.isArchived) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await RecentlyViewed.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { viewedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
