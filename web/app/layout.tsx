import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Task Management System Assessment',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <Toaster position="top-right" />
          <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
