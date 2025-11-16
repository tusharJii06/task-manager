'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const ok = await login({ email, password });

    setSubmitting(false);

    if (ok) {
      router.push('/dashboard');
    }
    // if not ok, user stays on page, toast already shown
  };


  return (
    <div className="mt-12 max-w-md mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="glass-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
