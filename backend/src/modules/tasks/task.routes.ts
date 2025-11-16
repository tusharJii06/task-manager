import { Router } from 'express';
import { TaskController } from './task.controller';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { createTaskSchema, updateTaskSchema } from './task.validators';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new TaskController();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler((req, res) => controller.list(req as any, res))
);

router.get(
  '/:id',
  asyncHandler((req, res) => controller.getById(req as any, res))
);

router.post(
  '/',
  validateBody(createTaskSchema),
  asyncHandler((req, res) => controller.create(req as any, res))
);

router.patch(
  '/:id',
  validateBody(updateTaskSchema),
  asyncHandler((req, res) => controller.update(req as any, res))
);

router.delete(
  '/:id',
  asyncHandler((req, res) => controller.delete(req as any, res))
);

router.post(
  '/:id/toggle',
  asyncHandler((req, res) => controller.toggle(req as any, res))
);

export default router;
