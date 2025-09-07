import { Question, User } from '@prisma/client';
import { prisma } from '@/utils/database';
import { AiService } from './aiService';
import { logger } from '@/utils/logger';
import { PaginationParams, PaginationResponse, QuestionStats, UserStats } from '@/types/api';

export class QuestionService {
  private aiService: AiService;

  constructor() {
    this.aiService = new AiService();
  }

  async askQuestion(
    question: string,
    userId: string,
    companyId: string,
  ): Promise<Question> {
    try {
      // Get AI response
      const aiResponse = await this.aiService.askQuestion(question);

      // Save question and answer to database
      const questionRecord = await prisma.question.create({
        data: {
          question,
          answer: aiResponse.answer,
          userId,
          companyId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info('Question processed and saved', {
        questionId: questionRecord.id,
        userId,
        companyId,
        model: aiResponse.model,
      });

      return questionRecord;
    } catch (error) {
      logger.error('Error processing question:', error);
      throw new Error('Failed to process question');
    }
  }

  async getUserQuestions(
    userId: string,
    companyId: string,
    pagination: PaginationParams,
  ): Promise<PaginationResponse<Question>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: {
          userId,
          companyId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.question.count({
        where: {
          userId,
          companyId,
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      data: questions,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  async getCompanyQuestions(
    companyId: string,
    pagination: PaginationParams,
  ): Promise<PaginationResponse<Question>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: {
          companyId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.question.count({
        where: {
          companyId,
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      data: questions,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  async getQuestionStats(
    companyId: string,
    days: number = 30,
  ): Promise<QuestionStats[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*)::int as count
      FROM questions 
      WHERE company_id = ${companyId}
        AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    ` as QuestionStats[];

    return stats;
  }

  async getTopUsers(
    companyId: string,
    limit: number = 10,
  ): Promise<UserStats[]> {
    const stats = await prisma.$queryRaw`
      SELECT 
        u.id as "userId",
        u.name as "userName",
        COUNT(q.id)::int as "questionCount"
      FROM users u
      LEFT JOIN questions q ON u.id = q.user_id
      WHERE u.company_id = ${companyId}
      GROUP BY u.id, u.name
      ORDER BY "questionCount" DESC
      LIMIT ${limit}
    ` as UserStats[];

    return stats;
  }

  async getQuestionById(
    questionId: string,
    companyId: string,
  ): Promise<Question | null> {
    return prisma.question.findFirst({
      where: {
        id: questionId,
        companyId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
