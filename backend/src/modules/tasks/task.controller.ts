import { Response } from 'express';
import { TaskService } from './task.service';
import { AuthenticatedRequest } from '../../middleware/auth';
import { TaskStatus } from '@prisma/client';

const taskService = new TaskService();

export class TaskController {
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { page = '1', pageSize = '10', status, search } = req.query as {
      page?: string;
      pageSize?: string;
      status?: TaskStatus;
      search?: string;
    };

    const pageNum = Math.max(parseInt(page || '1', 10) || 1, 1);
    const pageSizeNum = Math.min(Math.max(parseInt(pageSize || '10', 10) || 10, 1), 100);

    const result = await taskService.listTasks(userId, {
      page: pageNum,
      pageSize: pageSizeNum,
      status,
      search
    });

    res.json(result);
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const id = parseInt(req.params.id, 10);
    const task = await taskService.getTaskById(userId, id);
    res.json(task);
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const { title, description, status } = req.body as {
      title: string;
      description?: string;
      status?: TaskStatus;
    };

    const task = await taskService.createTask(userId, { title, description, status });
    res.status(201).json(task);
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const id = parseInt(req.params.id, 10);

    const { title, description, status } = req.body as {
      title?: string;
      description?: string;
      status?: TaskStatus;
    };

    const task = await taskService.updateTask(userId, id, { title, description, status });
    res.json(task);
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const id = parseInt(req.params.id, 10);
    await taskService.deleteTask(userId, id);
    res.status(204).send();
  }

  async toggle(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.userId!;
    const id = parseInt(req.params.id, 10);
    const task = await taskService.toggleTask(userId, id);
    res.json(task);
  }
}
