'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import toast from 'react-hot-toast';

type Props = {
  onCreated: () => void;
};

export default function TaskForm({ onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, description })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create task');
      }

      onCreated();
      setTitle('');
      setDescription('');
      toast.success('Task created');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="glass-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          maxLength={255}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="glass-textarea min-h-[100px]"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the task (optional)"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 disabled:opacity-60"
      >
        {submitting ? 'Saving...' : 'Add task'}
      </button>
    </form>
  );
}
