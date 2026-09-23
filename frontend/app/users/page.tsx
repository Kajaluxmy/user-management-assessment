'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';

import Navbar from '@/components/Navbar';
import UserTable from '@/components/UserTable';
import {
  getCurrentUser,
  getUsers,
} from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadUsers() {
    try {
      setError('');

      await getCurrentUser();

      const data = await getUsers();

      setUsers(data as User[]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unable to load users.');
      }

      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />

            <span className="text-sm font-medium text-slate-500">
              User Management
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View all registered users.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            <p className="text-sm font-medium text-slate-700">
              Loading users...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait while we fetch the users.
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-5 w-5 text-slate-500" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No users found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              There are no registered users yet.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {users.length}{' '}
                {users.length === 1 ? 'user' : 'users'} registered
              </p>
            </div>

            <UserTable users={users} />
          </div>
        )}
      </div>
    </main>
  );
}