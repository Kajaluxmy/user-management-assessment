'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Trash2 } from 'lucide-react';

import Navbar from '@/components/Navbar';
import UserForm from '@/components/UserForm';
import {
  getCurrentUser,
  updateMyProfile,
  deleteMyAccount,
  logoutUser,
} from '@/lib/api';

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentUser();

        setUser(data as CurrentUser);
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load profile.',
        );

        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleUpdate(data: {
    name: string;
    email: string;
  }) {
    const updatedUser = await updateMyProfile({
      name: data.name,
      email: data.email,
    });

    setUser(updatedUser as CurrentUser);
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      await deleteMyAccount();
      await logoutUser();

      router.push('/login');
      router.refresh();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to delete your account.',
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-600">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-slate-500" />

            <span className="text-sm font-medium text-slate-500">
              Account
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update your personal information or delete your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <UserForm
            initialValues={{
              name: user.name,
              email: user.email,
            }}
            submitLabel="Update Profile"
            onSubmit={handleUpdate}
          />

          <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Permanently delete your account.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />

              {deleting
                ? 'Deleting...'
                : 'Delete My Account'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}