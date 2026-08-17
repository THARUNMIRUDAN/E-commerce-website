import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// @desc    Get dashboard metrics & statistical summary
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ isArchived: { $ne: true } });
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    // Calculate total revenue from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // Recent 5 users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top selling products by order volume
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          image: { $first: '$orderItems.image' },
          totalSold: { $sum: '$orderItems.qty' },
          totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Low stock inventory warning (stock <= 5)
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 },
      isArchived: { $ne: true },
    }).select('name brand stock price images');

    res.json({
      metrics: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalRevenue,
      },
      recentOrders,
      recentUsers,
      topProducts,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with search & filter
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 15;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
            { phone: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const roleFilter = req.query.role && req.query.role !== 'all' ? { role: req.query.role } : {};

    const count = await User.countDocuments({ ...keyword, ...roleFilter });
    const users = await User.find({ ...keyword, ...roleFilter })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Protect the primary admin from losing admin rights
    if (user.email === 'admin@revibe.com' && role !== 'ADMIN') {
      return res.status(400).json({ message: 'Primary administrator role cannot be altered' });
    }

    user.role = role;
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block or Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email === 'admin@revibe.com') {
      return res.status(400).json({ message: 'Primary administrator cannot be blocked' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: user.isBlocked,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders with search & status filter
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 15;
    const page = Number(req.query.page) || 1;

    const statusFilter =
      req.query.status && req.query.status !== 'all' ? { orderStatus: req.query.status } : {};

    const keywordFilter = req.query.keyword
      ? {
          $or: [
            { orderCode: { $regex: req.query.keyword, $options: 'i' } },
            { 'shippingAddress.fullName': { $regex: req.query.keyword, $options: 'i' } },
            { 'shippingAddress.phone': { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const count = await Order.countDocuments({ ...statusFilter, ...keywordFilter });
    const orders = await Order.find({ ...statusFilter, ...keywordFilter })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`,
    });

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    // If cancelled by admin, return stock
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.qty },
        });
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
