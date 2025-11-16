import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.validators';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new AuthController();

router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler((req, res) => controller.register(req, res))
);

router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler((req, res) => controller.login(req, res))
);

router.post(
  '/refresh',
  asyncHandler((req, res) => controller.refresh(req, res))
);

router.post(
  '/logout',
  asyncHandler((req, res) => controller.logout(req, res))
);

export default router;
