import { Router } from 'express';
import { AdminController } from '@/controllers/adminController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';

const router = Router();
const adminController = new AdminController();

// Apply authentication and admin role requirement to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get question statistics
router.get('/stats/questions', adminController.getQuestionStats);

// Get top users
router.get('/stats/users', adminController.getTopUsers);

// Get dashboard summary
router.get('/dashboard', adminController.getDashboardSummary);

export default router;
