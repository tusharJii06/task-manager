import { prisma } from '../../db/prisma';
import { AppError } from '../../utils/appError';
import { TaskStatus } from '@prisma/client';

export class TaskService {
  async listTasks(
    userId: number,
    options: { page: number; pageSize: number; status?: TaskStatus; search?: string }
  ) {
    const { page, pageSize, status, search } = options;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.task.count({ where })
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async getTaskById(userId: number, id: number) {
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    return task;
  }

  async createTask(
    userId: number,
    data: { title: string; description?: string; status?: TaskStatus }
  ) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? 'TODO',
        userId
      }
    });
    return task;
  }

  async updateTask(
    userId: number,
    id: number,
    data: { title?: string; description?: string; status?: TaskStatus }
  ) {
    await this.getTaskById(userId, id);

    const updated = await prisma.task.update({
      where: { id },
      data
    });

    return updated;
  }

  async deleteTask(userId: number, id: number) {
    await this.getTaskById(userId, id);
    await prisma.task.delete({ where: { id } });
  }

  async toggleTask(userId: number, id: number) {
    const task = await this.getTaskById(userId, id);

    let newStatus: TaskStatus;

    if (task.status === 'TODO') {
      newStatus = 'IN_PROGRESS';
    } else if (task.status === 'IN_PROGRESS') {
      newStatus = 'DONE';
    } else {
      // DONE -> back to TODO
      newStatus = 'TODO';
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { status: newStatus }
    });

    return updated;
  }
}
