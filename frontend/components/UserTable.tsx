'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({
  users,
}: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Created
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user._id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-sm font-medium text-slate-900">
                      {user.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {user.email}
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/users/${user._id}`}
                    className="flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">
            No users found
          </p>

          <p className="mt-1 text-sm text-slate-400">
            No registered users are available.
          </p>
        </div>
      )}
    </div>
  );
}