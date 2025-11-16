import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mt-12 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Task Manager</h1>
      <p className="text-gray-600 mb-4">
        Simple, production-ready task management system.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded bg-blue-600 text-white px-4 py-2 font-medium"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded border border-blue-600 text-blue-600 px-4 py-2 font-medium"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
