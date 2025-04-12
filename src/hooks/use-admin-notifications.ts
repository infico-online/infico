'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from './use-telegram';
import { prisma } from '@/lib/prisma';

export function useAdminNotifications() {
  const { user } = useTelegram();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      
      try {
        const data = await prisma.adminNotification.findMany({
          where: {
            recipientIds: {
              has: user.id
            },
            isRead: false
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  return { notifications, loading };
}
