'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { getUser } from '@/lib/api';

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UserDetailsPage() {
  const params = useParams();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        const id = params.id as string;

        const data = await getUser(id);

        setUser(data as UserDetails);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unable to load user.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="text-sm text-slate-600">
            Loading user...
          </p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              Unable to load user
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error || 'User not found.'}
            </p>
          </div>

          <Link
            href="/users"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to users
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href="/users"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-slate-500" />

            <span className="text-sm font-medium text-slate-500">
              User Details
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {user.name}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View user information.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {user.name}
              </h2>

              <p className="text-sm text-slate-500">
                Registered user
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}