import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Specific routes before :id param
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id/related', getRelatedProducts);

// General CRUD
router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
