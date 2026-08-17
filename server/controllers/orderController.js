import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    // Verify each product and calculate prices dynamically from DB to prevent tampering
    let itemsPrice = 0;
    let originalItemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || product.isArchived) {
        return res.status(400).json({
          message: `Product ${item.name || 'item'} is no longer available`,
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.stock} left in stock.`,
        });
      }

      const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      itemsPrice += activePrice * item.qty;
      originalItemsPrice += product.price * item.qty;

      verifiedOrderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.images[0] || '',
        price: activePrice,
        product: product._id,
      });
    }

    const discountAmount = originalItemsPrice - itemsPrice;
    const deliveryPrice = itemsPrice > 1500 || itemsPrice === 0 ? 0 : 99;
    const totalPrice = itemsPrice + deliveryPrice;

    const order = new Order({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discountAmount,
      deliveryPrice,
      totalPrice,
      orderStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed successfully. Waiting for store confirmation.',
        },
      ],
    });

    const createdOrder = await order.save();

    // Decrement product stock
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name images');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images brand');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization check: must be owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Order cannot be cancelled as it is already ${order.orderStatus}`,
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Order cancelled by customer',
    });

    await order.save();

    // Restock the inventory
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
