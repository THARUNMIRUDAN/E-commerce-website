import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Fetch all active categories with product counts
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Aggregate product counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          isArchived: { $ne: true },
        });
        return {
          ...cat.toObject(),
          productCount: count,
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if products exist in category
    const productsInCat = await Product.countDocuments({ category: category._id });
    if (productsInCat > 0) {
      return res.status(400).json({
        message: `Cannot delete category. There are ${productsInCat} products associated with it.`,
      });
    }

    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
