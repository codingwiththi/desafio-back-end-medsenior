import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types/express';
import { JwtPayload } from '@/types/api';
import { createErrorResponse } from '@/utils/response';
import { logger } from '@/utils/logger';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json(createErrorResponse('Access token required'));
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json(createErrorResponse('JWT configuration error'));
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token attempt', { ip: req.ip });
    res.status(403).json(createErrorResponse('Invalid or expired token'));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(createErrorResponse('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json(createErrorResponse('Insufficient permissions'));
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
