import { Response } from 'express';
import { QuestionService } from '@/services/questionService';
import { AuthRequest } from '@/types/express';
import { createSuccessResponse, createErrorResponse } from '@/utils/response';
import { logger } from '@/utils/logger';
import { PaginationParams } from '@/types/api';

export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  askQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { question } = req.body;
      const { userId, companyId } = req.user;

      const result = await this.questionService.askQuestion(
        question,
        userId,
        companyId,
      );

      res
        .status(201)
        .json(createSuccessResponse(result, 'Question processed successfully'));
    } catch (error) {
      logger.error('Ask question error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to process question';
      res.status(500).json(createErrorResponse(message));
    }
  };

  getUserQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { userId, companyId } = req.user;
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await this.questionService.getUserQuestions(
        userId,
        companyId,
        pagination,
      );

      res
        .status(200)
        .json(
          createSuccessResponse(result, 'Questions retrieved successfully'),
        );
    } catch (error) {
      logger.error('Get user questions error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to retrieve questions';
      res.status(500).json(createErrorResponse(message));
    }
  };

  getCompanyQuestions = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { companyId } = req.user;
      const pagination: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await this.questionService.getCompanyQuestions(
        companyId,
        pagination,
      );

      res
        .status(200)
        .json(
          createSuccessResponse(
            result,
            'Company questions retrieved successfully',
          ),
        );
    } catch (error) {
      logger.error('Get company questions error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve company questions';
      res.status(500).json(createErrorResponse(message));
    }
  };

  getQuestionById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('Authentication required'));
        return;
      }

      const { questionId } = req.params;
      const { companyId } = req.user;

      if (!questionId) {
        res.status(400).json(createErrorResponse('Question ID is required'));
        return;
      }

      const question = await this.questionService.getQuestionById(
        questionId,
        companyId,
      );

      if (!question) {
        res.status(404).json(createErrorResponse('Question not found'));
        return;
      }

      res
        .status(200)
        .json(
          createSuccessResponse(question, 'Question retrieved successfully'),
        );
    } catch (error) {
      logger.error('Get question by ID error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to retrieve question';
      res.status(500).json(createErrorResponse(message));
    }
  };
}
