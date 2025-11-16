import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

const REFRESH_COOKIE_NAME = 'refreshToken';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production'
};

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };
    const { user, accessToken, refreshToken } = await authService.register(email, password);

    res
      .cookie(REFRESH_COOKIE_NAME, refreshToken, {
        ...baseCookieOptions,
        path: '/auth'
      })
      .status(201)
      .json({ user, accessToken });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string };
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res
      .cookie(REFRESH_COOKIE_NAME, refreshToken, {
        ...baseCookieOptions,
        path: '/auth'
      })
      .json({ user, accessToken });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const token = req.cookies[REFRESH_COOKIE_NAME] as string | undefined;
    if (!token) {
      res.status(401).json({ message: 'Missing refresh token' });
      return;
    }

    const { accessToken } = await authService.refresh(token);
    res.json({ accessToken });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const token = req.cookies[REFRESH_COOKIE_NAME] as string | undefined;
    if (token) {
      await authService.logout(token);
    }

    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...baseCookieOptions,
      path: '/auth'
    });

    res.json({ message: 'Logged out' });
  }
}
