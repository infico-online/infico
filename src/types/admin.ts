export interface AdminNotification {
  id: string;
  message: string;
  createdAt: string;
  type: 'info' | 'warning' | 'error';
  read: boolean;
}
