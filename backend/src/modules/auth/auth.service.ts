import { prisma } from '../../db/prisma';
import { AppError } from '../../utils/appError';
import { comparePassword, hashPassword } from '../../utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../../utils/jwt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(400, 'Email already in use');
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, passwordHash }
    });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    const decoded = jwt.decode(refreshToken) as { exp?: number } | null;

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : new Date()
      }
    });

    return { user: { id: user.id, email: user.email }, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'Invalid credentials');
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    const decoded = jwt.decode(refreshToken) as { exp?: number } | null;

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : new Date()
      }
    });

    return { user: { id: user.id, email: user.email }, accessToken, refreshToken };
  }

  async refresh(oldToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(oldToken);
      if (payload.type !== 'refresh') {
        throw new Error('Not a refresh token');
      }
    } catch {
      throw new AppError(401, 'Invalid refresh token');
    }

    const stored = await prisma.refreshToken.findFirst({
      where: { token: oldToken, isRevoked: false }
    });

    if (!stored) {
      throw new AppError(401, 'Refresh token not found');
    }

    const accessToken = signAccessToken(payload.userId);
    return { accessToken };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, isRevoked: false },
      data: { isRevoked: true }
    });
  }
}
