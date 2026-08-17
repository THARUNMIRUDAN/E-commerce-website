import express from 'express';
import {
  getRecentlyViewed,
  recordRecentlyViewed,
} from '../controllers/recentlyViewedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getRecentlyViewed).post(recordRecentlyViewed);

export default router;
