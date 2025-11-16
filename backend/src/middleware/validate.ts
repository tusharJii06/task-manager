import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

function handleValidationError(err: unknown, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation error', errors: err.flatten() });
  } else {
    next(err);
  }
}

export function validateBody(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      handleValidationError(err, res, next);
    }
  };
}
