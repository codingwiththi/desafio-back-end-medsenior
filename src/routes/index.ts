import { Router } from 'express';
import authRoutes from './auth';
import questionRoutes from './questions';
import adminRoutes from './admin';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/admin', adminRoutes);

export default router;
