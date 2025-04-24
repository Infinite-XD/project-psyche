import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 1) Try cookie first…
    const cookieToken = req.cookies?.auth_token;
    // 2) …then fall back to Authorization header
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') && authHeader.split(' ')[1];
    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Optional middleware for routes that can be accessed with or without authentication
export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const user = await authService.verifyToken(token);
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Just continue without setting user
    next();
  }
}