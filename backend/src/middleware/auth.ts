import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') {
      res.status(401).json({ message: 'Invalid token type' });
      return;
    }
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
