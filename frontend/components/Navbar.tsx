'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Users } from 'lucide-react';
import { logoutUser } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutUser();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/users"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
            <Users className="h-4 w-4 text-white" />
          </div>

          <div>
            <p className="text-base font-semibold tracking-tight text-slate-900">
              User Management
            </p>

            <p className="hidden text-xs text-slate-400 sm:block">
              Manage your account
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/users"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">
              Users
            </span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              Profile
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}