import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import {
  validateSchema,
  registerSchema,
  loginSchema,
} from '@/middleware/validation';
import { authLimiter } from '@/middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Register route
router.post(
  '/register',
  validateSchema(registerSchema),
  authController.register,
);

// Login route
router.post('/login', validateSchema(loginSchema), authController.login);

// Refresh token route
router.post('/refresh', authController.refreshToken);

// Logout route
router.post('/logout', authController.logout);

export default router;
