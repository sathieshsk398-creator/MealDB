import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart operations require valid JWT authentication
router.use(protect);

/**
 * @route   GET /api/cart -> Get user's cart
 * @route   POST /api/cart -> Add item or update quantity in cart
 * @route   DELETE /api/cart -> Clear all items in cart
 */
router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

/**
 * @route   DELETE /api/cart/:idMeal -> Remove specific food item from cart
 */
router.delete('/:idMeal', removeFromCart);

export default router;
