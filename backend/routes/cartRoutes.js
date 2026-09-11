import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart operations require valid JWT authentication via authMiddleware
router.use(authMiddleware);

/**
 * @route   GET /api/cart -> Get user's cart
 * @route   POST /api/cart -> Add item or update quantity in cart
 * @route   DELETE /api/cart -> Delete item (if idMeal in body/query) or clear cart
 */
router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete((req, res, next) => {
    if (req.body?.idMeal || req.body?.mealId || req.query?.idMeal) {
      return removeFromCart(req, res, next);
    }
    return clearCart(req, res, next);
  });

/**
 * @route   DELETE /api/cart/:idMeal -> Remove specific food item from cart
 */
router.delete('/:idMeal', removeFromCart);

export default router;
