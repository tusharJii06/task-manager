export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTasks {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
