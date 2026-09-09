import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & get JWT token
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile (protected)
 */
router.get('/profile', protect, getUserProfile);

export default router;
