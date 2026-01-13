import { Router } from 'express';
import { signup, verifyOTP, resendOTP, login, updateProfile, getAttorneys } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/auth/signup', signup);
router.post('/auth/verify-otp', verifyOTP);
router.post('/auth/resend-otp', resendOTP);
router.post('/auth/login', login);

// Protected routes (require authentication)
router.put('/user/profile', authMiddleware, updateProfile);
router.get('/attorneys', getAttorneys);

export default router;
