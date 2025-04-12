'use client';

import {  useRouter, usePathname  } from "next/navigation";
import {  Button  } from "@/components/ui/button";
import {  
  BarChart,
  Users,
  Radio,
  Package,
  FileText,
  Settings,
  Shield,
  ActivitySquare,
  LogOut,
  Home
 } from 'lucide-react';
import {  cn  } from "@/lib/utils";

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart,
    path: '/admin',
    description: 'Overview and statistics'
  },
  {
    title: 'Users',
    icon: Users,
    path: '/admin/users',
    description: 'User management'
  },
  {
    title: 'ICO',
    icon: Package,
    path: '/admin/ico',
    description: 'ICO management'
  },
  {
    title: 'Channels',
    icon: Radio,
    path: '/admin/channels',
    description: 'Channel verification'
  },
  {
    title: 'Logs',
    icon: FileText,
    path: '/admin/logs',
    description: 'System logs'
  },
  {
    title: 'Monitoring',
    icon: ActivitySquare,
    path: '/admin/monitoring',
    description: 'System monitoring'
  },
  {
    title: 'Security',
    icon: Shield,
    path: '/admin/security',
    description: 'Security settings'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/admin/settings',
    description: 'System settings'
  }
];

function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r min-h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">INFICO Admin</h2>
        <p className="text-sm text-muted-foreground">Management Panel</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive && "bg-secondary"
                )}
                onClick={() => router.push(item.path)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => router.push('/')}
        >
          <Home className="h-4 w-4" />
          <span>Back to App</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600"
          onClick={() => {
            // Здесь добавить логику выхода
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
