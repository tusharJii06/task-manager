import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: number;
  type: 'access' | 'refresh';
}

export function signAccessToken(userId: number): string {
  return jwt.sign({ userId, type: 'access' } as JwtPayload, env.accessTokenSecret, {
    expiresIn: env.accessTokenExpiresIn
  });
}

export function signRefreshToken(userId: number): string {
  return jwt.sign({ userId, type: 'refresh' } as JwtPayload, env.refreshTokenSecret, {
    expiresIn: env.refreshTokenExpiresIn
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.accessTokenSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.refreshTokenSecret) as JwtPayload;
}
