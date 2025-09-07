import { Router } from 'express';
import { QuestionController } from '@/controllers/questionController';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import {
  validateSchema,
  questionSchema,
  validateQuery,
  paginationSchema,
} from '@/middleware/validation';

const router = Router();
const questionController = new QuestionController();

// Apply authentication to all question routes
router.use(authenticateToken);

// Ask a question
router.post(
  '/',
  validateSchema(questionSchema),
  questionController.askQuestion,
);

// Get user's own questions
router.get(
  '/my-questions',
  validateQuery(paginationSchema),
  questionController.getUserQuestions,
);

// Get all company questions (for admins)
router.get(
  '/company',
  requireAdmin,
  validateQuery(paginationSchema),
  questionController.getCompanyQuestions,
);

// Get question by ID
router.get('/:questionId', questionController.getQuestionById);

export default router;
