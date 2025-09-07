import { Response } from 'express';
import { QuestionService } from '@/services/questionService';
import { AuthRequest } from '@/types/express';
import { createSuccessResponse, createErrorResponse } from '@/utils/response';
import { logger } from '@/utils/logger';

export class AdminController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  getQuestionStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { companyId } = req.user;
      const days = parseInt(req.query?.days as string) || 30;

      const stats = await this.questionService.getQuestionStats(companyId, days);

      res.status(200).json(
        createSuccessResponse(stats, 'Question statistics retrieved successfully'),
      );
    } catch (error) {
      logger.error('Get question stats error:', error);
      const message = error instanceof Error ? error.message : 'Failed to retrieve statistics';
      res.status(500).json(createErrorResponse(message));
    }
  };

  getTopUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { companyId } = req.user;
      const limit = parseInt(req.query?.limit as string) || 10;

      const stats = await this.questionService.getTopUsers(companyId, limit);

      res.status(200).json(
        createSuccessResponse(stats, 'Top users retrieved successfully'),
      );
    } catch (error) {
      logger.error('Get top users error:', error);
      const message = error instanceof Error ? error.message : 'Failed to retrieve top users';
      res.status(500).json(createErrorResponse(message));
    }
  };

  getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { companyId } = req.user;

      // Get various statistics
      const [questionStats, topUsers] = await Promise.all([
        this.questionService.getQuestionStats(companyId, 7), // Last 7 days
        this.questionService.getTopUsers(companyId, 5), // Top 5 users
      ]);

      // Calculate total questions this week
      const totalQuestionsThisWeek = questionStats.reduce(
        (sum, stat) => sum + stat.count,
        0,
      );

      const summary = {
        totalQuestionsThisWeek,
        questionStats,
        topUsers,
        generatedAt: new Date().toISOString(),
      };

      res.status(200).json(
        createSuccessResponse(summary, 'Dashboard summary retrieved successfully'),
      );
    } catch (error) {
      logger.error('Get dashboard summary error:', error);
      const message = error instanceof Error ? error.message : 'Failed to retrieve dashboard summary';
      res.status(500).json(createErrorResponse(message));
    }
  };
}
