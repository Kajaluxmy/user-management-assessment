
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, User } from 'lucide-react';

import Navbar from '@/components/Navbar';
import UserForm from '@/components/UserForm';
import {
  deleteMyAccount,
  getCurrentUser,
  logoutUser,
  updateMyProfile,
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
        setError('');

        const data = await getCurrentUser();

        setUser(data as CurrentUser);
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load your profile.',
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
    try {
      setError('');

      const updatedUser = await updateMyProfile({
        name: data.name,
        email: data.email,
      });

      setUser(updatedUser as CurrentUser);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to update your profile.',
      );
    }
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

        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

              <p className="text-sm font-medium text-slate-700">
                Loading your profile...
              </p>
            </div>
          </div>
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

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Page Header */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <User
                className="h-4 w-4 text-white"
                aria-hidden="true"
              />
            </div>

            <span className="text-sm font-medium text-slate-500">
              Account
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and account settings.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="space-y-6">

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your name and email address.
              </p>
            </div>

            <UserForm
              initialValues={{
                name: user.name,
                email: user.email,
              }}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View your account details.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {user.name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-2 break-all text-sm font-medium text-slate-700">
                  {user.email}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Member Since
                </p>

                <p className="mt-2 text-sm font-medium text-slate-700">
                  {new Date(user.createdAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </p>
              </div>

            </div>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <Trash2
                  className="h-5 w-5 text-red-600"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Delete Account
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Permanently delete your account and all associated
                  information. This action cannot be undone.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2
                className="h-4 w-4"
                aria-hidden="true"
              />

              {deleting
                ? 'Deleting Account...'
                : 'Delete Account'}
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}

