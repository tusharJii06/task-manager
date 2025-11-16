import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional()
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional()
});
