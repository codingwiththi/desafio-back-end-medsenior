import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { createSuccessResponse, createErrorResponse } from '@/utils/response';
import { logger } from '@/utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, companyName } = req.body;

      const result = await this.authService.register(
        email,
        password,
        name,
        companyName,
      );

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = result.user;

      res.status(201).json(
        createSuccessResponse(
          {
            user: userWithoutPassword,
            company: result.company,
            tokens: result.tokens,
          },
          'User registered successfully',
        ),
      );
    } catch (error) {
      logger.error('Registration error:', error);
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json(createErrorResponse(message));
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = result.user;

      res.status(200).json(
        createSuccessResponse(
          {
            user: userWithoutPassword,
            company: result.company,
            tokens: result.tokens,
          },
          'Login successful',
        ),
      );
    } catch (error) {
      logger.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json(createErrorResponse(message));
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json(createErrorResponse('Refresh token is required'));
        return;
      }

      const tokens = await this.authService.refreshToken(refreshToken);

      res.status(200).json(
        createSuccessResponse(tokens, 'Token refreshed successfully'),
      );
    } catch (error) {
      logger.error('Token refresh error:', error);
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      res.status(401).json(createErrorResponse(message));
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }

      res.status(200).json(
        createSuccessResponse(null, 'Logout successful'),
      );
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(200).json(
        createSuccessResponse(null, 'Logout successful'),
      );
    }
  };
}
