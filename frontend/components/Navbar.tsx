
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User, Users } from 'lucide-react';

import { logoutUser } from '@/lib/api';

const navigationItems = [
  {
    label: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await logoutUser();

      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        <Link
          href="/users"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
            <Users
              className="h-4 w-4 text-white"
              aria-hidden="true"
            />
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

        <div className="flex items-center gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span className="hidden sm:inline">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="ml-1 flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

