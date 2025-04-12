'use client';

import { useAdminNotifications } from '@/hooks/use-admin-notifications';

export function NotificationsPanel() {
  const { notifications, loading } = useAdminNotifications();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="p-4 bg-white shadow rounded">
          <h3 className="font-medium">{notification.title}</h3>
          <p className="text-sm text-gray-500">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
