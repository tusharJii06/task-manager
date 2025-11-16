'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { PaginatedTasks, Task, TaskStatus } from '@/lib/types';
import toast from 'react-hot-toast';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

const statusOptions: (TaskStatus | 'ALL')[] = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE'];

export default function DashboardPage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const PAGE_SIZE = 5;

    const handleLogout = async () => {
        await logout();     // clears tokens + user in context
        setTasks([]);       // clear tasks from UI immediately
        router.push('/login'); // redirect to login page
    };

    const loadTasks = async (pageToLoad = page) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', String(pageToLoad));
            params.set('pageSize', String(PAGE_SIZE));
            if (statusFilter !== 'ALL') params.set('status', statusFilter);
            if (search) params.set('search', search);

            const res = await apiFetch(`/tasks?${params.toString()}`);
            const data = await res.json().catch(() => ({}));

            if (res.status === 401) {
                router.push('/login');
                return;
            }

            if (!res.ok) {
                throw new Error(data.message || 'Failed to load tasks');
            }

            const parsed = data as PaginatedTasks;
            setTasks(parsed.items);
            setPage(parsed.page);
            setTotalPages(parsed.totalPages);
        } catch (err: any) {
            toast.error(err.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyFilters = () => {
        loadTasks(1);
    };

    return (
        <main className="mt-8 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Your tasks</h1>
                    <p className="text-sm text-gray-600">
                        Manage tasks with pagination, search and status filters.
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                >
                    Logout
                </button>
            </header>

            <section className="grid gap-6 md:grid-cols-[1.3fr,1fr] items-start">
                <div className="flex flex-col gap-3 max-h-[calc(100vh-220px)] rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl p-4">
                    {/* Filters */}
                    <div className="flex flex-wrap items-end gap-3">
                        {/* status dropdown, search input, Apply button (unchanged) */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Status</label>
                            <select
                                className="glass-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value as TaskStatus | 'ALL')
                                }
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status === 'ALL' ? 'All' : status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[160px]">
                            <label className="block text-xs font-medium mb-1">
                                Search by title
                            </label>
                            <input
                                className="glass-input"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={applyFilters}
                            className="rounded bg-blue-600 text-white px-3 py-1 text-sm font-medium"
                        >
                            Apply
                        </button>
                    </div>

                    {/* Scrollable task list */}
                    <div className="flex-1 overflow-auto pr-1 mt-1">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading tasks...</p>
                        ) : (
                            <TaskList tasks={tasks} onChange={setTasks} />
                        )}
                    </div>

                    {/* Pagination (only if more than one page) */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-gray-500">
                                Page {page} of {totalPages}
                            </span>
                            <div className="space-x-2">
                                {page > 1 && (
                                    <button
                                        onClick={() => {
                                            const newPage = page - 1;
                                            setPage(newPage);
                                            loadTasks(newPage);
                                        }}
                                        className="rounded border px-2 py-1 text-xs"
                                    >
                                        Prev
                                    </button>
                                )}

                                {page < totalPages && (
                                    <button
                                        onClick={() => {
                                            const newPage = page + 1;
                                            setPage(newPage);
                                            loadTasks(newPage);
                                        }}
                                        className="rounded border px-2 py-1 text-xs"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column unchanged */}
                <aside className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl p-4">
                    <h2 className="text-lg font-semibold mb-3">Add a new task</h2>
                    <TaskForm
                        onCreated={() => {
                            loadTasks(1);
                        }}
                    />
                </aside>
            </section>

        </main>
    );
}
