import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
}
