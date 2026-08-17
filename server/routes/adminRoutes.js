import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  toggleBlockUser,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Protect all admin endpoints with JWT & ADMIN role verification
router.use(protect, admin);

router.get('/stats', getAdminStats);

// User administration
router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/block', toggleBlockUser);

// Order administration
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
