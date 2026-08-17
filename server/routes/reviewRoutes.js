import express from 'express';
import {
  getProductReviews,
  checkReviewEligibility,
  createProductReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/eligibility', protect, checkReviewEligibility);
router.post('/', protect, createProductReview);

export default router;
