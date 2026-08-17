import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Calculate cart financial totals
const calculateTotals = (cart) => {
  let subtotal = 0;
  let originalSubtotal = 0;
  let totalItems = 0;

  const validItems = [];

  for (const item of cart.items) {
    if (item.product && !item.product.isArchived) {
      const activePrice = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      const originalPrice = item.product.price;
      
      subtotal += activePrice * item.quantity;
      originalSubtotal += originalPrice * item.quantity;
      totalItems += item.quantity;
      validItems.push(item);
    }
  }

  const discount = originalSubtotal - subtotal;
  const deliveryCharge = subtotal > 1500 || subtotal === 0 ? 0 : 99; // Free shipping above ₹1500
  const grandTotal = subtotal + deliveryCharge;

  return {
    items: validItems,
    totalItems,
    originalSubtotal,
    subtotal,
    discount,
    deliveryCharge,
    grandTotal,
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: { path: 'category', select: 'name slug' },
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const calculated = calculateTotals(cart);
    res.json({
      _id: cart._id,
      ...calculated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || product.isArchived) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: 'Product is currently out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`,
        });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = price;
    } else {
      if (Number(quantity) > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`,
        });
      }
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'category', select: 'name slug' },
    });

    const calculated = calculateTotals(populatedCart);
    res.json({
      _id: cart._id,
      ...calculated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const qty = Number(quantity);

    if (qty <= 0) {
      // Remove item if quantity <= 0
      cart.items.splice(itemIndex, 1);
    } else {
      if (qty > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`,
        });
      }
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'category', select: 'name slug' },
    });

    const calculated = calculateTotals(populatedCart);
    res.json({
      _id: cart._id,
      ...calculated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'category', select: 'name slug' },
    });

    const calculated = calculateTotals(populatedCart);
    res.json({
      _id: cart._id,
      ...calculated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all items in cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      items: [],
      totalItems: 0,
      originalSubtotal: 0,
      subtotal: 0,
      discount: 0,
      deliveryCharge: 0,
      grandTotal: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
