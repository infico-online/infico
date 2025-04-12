export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  details: any;
  status: 'SUCCESS' | 'FAILED';
  createdAt: Date;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  context: string;
  message: string;
  data?: any;
  createdAt: Date;
}

export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  type: 'GAUGE' | 'COUNTER';
  createdAt: Date;
}

export interface AdminStats {
  activeUsers: number;
  totalChannels: number;
  activeICOs: number;
  volume24h: number;
  pendingVerifications: number;
  tokenOperations: {
    buyRequests: number;
    withdrawRequests: number;
  };
}

export interface AdminUser {
  id: string;
  telegramId: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  name: string;
  isVerified: boolean;
  lastLogin?: Date;
}

export interface AdminNotification {
  id: string;
  type: 'ACTION' | 'ALERT' | 'INFO';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export type AdminSectionType = 
  | 'analytics'
  | 'users'
  | 'ico'
  | 'channels'
  | 'logs'
  | 'settings'
  | 'actions'
  | 'security'
  | 'monitoring';

export interface AdminSection {
  title: string;
  path: string;
  icon: any;
  description: string;
  badge?: number;
  type: AdminSectionType;
}
