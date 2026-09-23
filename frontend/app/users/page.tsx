'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Users } from 'lucide-react';

import Navbar from '@/components/Navbar';
import UserTable from '@/components/UserTable';
import {
  deleteUser,
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

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      await deleteUser(id);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== id),
      );
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to delete user.',
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
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
              Manage and view all registered users.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/users/create')}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
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
              Create your first user to get started.
            </p>

            <button
              type="button"
              onClick={() => router.push('/users/create')}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Create User
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {users.length}{' '}
                {users.length === 1 ? 'user' : 'users'} registered
              </p>
            </div>

            <UserTable
              users={users}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </main>
  );
}