import { NextFunction, RequestHandler } from 'express';

/**
 * Wrap an async route/controller so that any thrown error
 * is forwarded to Express error handler instead of causing
 * an unhandled promise rejection.
 */
export const asyncHandler = (
  fn: (req: any, res: any, next?: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
