'use client';

import { Task, TaskStatus } from '@/lib/types';
import { apiFetch } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { useState } from 'react';

type Props = {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
};

export default function TaskList({ tasks, onChange }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description ?? '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (taskId: number) => {
    try {
      const res = await apiFetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: editTitle, description: editDescription })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update task');
      }

      const updated = data as Task;
      onChange(tasks.map((t) => (t.id === taskId ? updated : t)));
      toast.success('Task updated');
      cancelEdit();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update task');
    }
  };

  const toggleStatus = async (task: Task) => {
    try {
      const res = await apiFetch(`/tasks/${task.id}/toggle`, {
        method: 'POST'
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to toggle task');
      }

      const updated = data as Task;
      onChange(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle task');
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm('Delete this task?')) return;

    try {
      const res = await apiFetch(`/tasks/${taskId}`, { method: 'DELETE' });

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete task');
      }

      onChange(tasks.filter((t) => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  const statusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!tasks.length) {
    return <p className="text-gray-500 text-sm">No tasks yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 shadow-sm"
        >

          {editingId === task.id ? (
            <div className="flex-1 mr-4 space-y-2">
              <input
                className="glass-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                className="glass-textarea min-h-[60px]"
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <div className="space-x-2">
                <button
                  onClick={() => saveEdit(task.id)}
                  className="rounded bg-blue-600 text-white px-2 py-1 text-xs"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="rounded border px-2 py-1 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 mr-4">
              <h3
                className={`font-medium ${task.status === 'DONE' ? 'line-through text-gray-400' : ''
                  }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
              <span
                className={`inline-flex mt-2 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <button
              onClick={() =>
                editingId === task.id ? cancelEdit() : startEdit(task)
              }
              className="rounded border px-2 py-1 text-xs"
            >
              {editingId === task.id ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={() => toggleStatus(task)}
              className="rounded border px-2 py-1 text-xs"
            >
              Next status
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="rounded border border-red-500 text-red-600 px-2 py-1 text-xs"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
