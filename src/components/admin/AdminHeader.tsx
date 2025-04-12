'use client';

import { NotificationsPanel } from './NotificationsPanel';

export function AdminHeader() {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <NotificationsPanel />
    </header>
  );
}
