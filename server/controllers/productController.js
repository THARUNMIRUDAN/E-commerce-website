import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    // 1. Search query
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    // 2. Category filter
    let categoryFilter = {};
    if (req.query.category && req.query.category !== 'all') {
      // Find category by slug or id
      const cat = await Category.findOne({
        $or: [{ _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }, { slug: req.query.category }],
      });
      if (cat) {
        categoryFilter = { category: cat._id };
      }
    }

    // 3. Brand filter
    const brandFilter = req.query.brand && req.query.brand !== 'all'
      ? { brand: { $in: req.query.brand.split(',') } }
      : {};

    // 4. Price filter
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    // 5. Rating filter
    const minRating = Number(req.query.rating) || 0;
    const ratingFilter = minRating > 0 ? { rating: { $gte: minRating } } : {};

    // 6. In-Stock filter
    const stockFilter = req.query.inStock === 'true' ? { stock: { $gt: 0 } } : {};

    // Combine all filters
    const queryFilter = {
      isArchived: { $ne: true },
      ...keyword,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
      ...stockFilter,
    };

    // 7. Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { rating: -1, numReviews: -1 };
    } else if (req.query.sort === 'popular') {
      sortOption = { numReviews: -1, rating: -1 };
    }

    const count = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Get available brands for the filter sidebar
    const allBrands = await Product.distinct('brand', { isArchived: { $ne: true } });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
      brands: allBrands.sort(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (product && !product.isArchived) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isArchived: { $ne: true } })
      .populate('category', 'name slug')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isArchived: { $ne: true } })
      .populate('category', 'name slug')
      .sort({ rating: -1, numReviews: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isArchived: { $ne: true } })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isArchived: { $ne: true },
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      specifications,
      price,
      discountPrice,
      images,
      stock,
      featured,
    } = req.body;

    if (!name || !brand || !category || !description || price === undefined) {
      return res.status(400).json({ message: 'Please provide all required product fields' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = new Product({
      name,
      slug,
      brand,
      category,
      description,
      specifications: specifications || [],
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      stock: Number(stock) || 0,
      featured: Boolean(featured),
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      brand,
      category,
      description,
      specifications,
      price,
      discountPrice,
      images,
      stock,
      featured,
    } = req.body;

    if (name) {
      product.name = name;
      product.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (description) product.description = description;
    if (specifications !== undefined) product.specifications = specifications;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = Number(stock);
    if (featured !== undefined) product.featured = Boolean(featured);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete or hard delete
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
