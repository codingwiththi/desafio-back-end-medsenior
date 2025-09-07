import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '@/utils/response';

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      res.status(400).json(createErrorResponse(errorMessage));
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  companyName: Joi.string().min(2).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const questionSchema = Joi.object({
  question: Joi.string().min(5).max(1000).required(),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      res.status(400).json(createErrorResponse(errorMessage));
      return;
    }
    
    req.query = value;
    next();
  };
};
