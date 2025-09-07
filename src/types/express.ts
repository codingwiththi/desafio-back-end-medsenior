import { Request } from 'express';
import { JwtPayload } from './api';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
