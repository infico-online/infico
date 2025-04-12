'use client';

import {  
  BarChart, Users, Package, Radio, Settings, FileText,
  LogOut, Home, Shield, Bell, History, Lock
 } from 'lucide-react';
import {  useRouter, usePathname  } from "next/navigation";
import {  Button  } from "@/components/ui/button";
import {  cn  } from "@/lib/utils";
import {  motion  } from "framer-motion";
import {  useState, useEffect  } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
 } from '@/components/ui/tooltip'
import {  logger  } from "@/lib/logger";

const menuItems = [
  { 
    title: 'Analytics', 
    icon: BarChart, 
    path: '/admin/analytics',
    description: 'Platform statistics'
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
    title: 'Settings', 
    icon: Settings, 
    path: '/admin/settings',
    description: 'System settings'
  }
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  return (
    <TooltipProvider>
      <div className="flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">INFICO Admin</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 mb-1",
                        isActive && "bg-gray-100"
                      )}
                      onClick={() => router.push(item.path)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4" />
                <span>Back to App</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to main application</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-500 hover:text-red-600"
                onClick={() => router.push('/')}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign out from admin panel</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
