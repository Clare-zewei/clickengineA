import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw createError(401, 'Access token is required');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError(500, 'JWT secret not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = decoded;
    
    logger.debug('User authenticated', { userId: decoded.id });
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as any;
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

export const generateToken = (payload: object): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secret not configured');
  }
  
  return jwt.sign(payload, jwtSecret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  } as jwt.SignOptions);
};