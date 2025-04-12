'use client';

import {  useRouter  } from "next/navigation";
import {  useState, useEffect  } from "react";
import {  Button  } from "@/components/ui/button";
import {  
  Shield, 
  Settings, 
  HelpCircle, 
  Info,
  User,
  LogOut
 } from 'lucide-react';
import {  Card  } from "@/components/ui/card";
import {  useTelegram  } from "@/lib/telegram";
import {  logger  } from "@/lib/logger";

export default function MorePage() {
  const router = useRouter();
  const { getUserId } = useTelegram();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const userId = getUserId();
        logger.info('MorePage', 'Checking admin access', { userId });

        const response = await fetch(`/api/admin/check-access?userId=${userId}`);
        const data = await response.json();
        
        logger.info('MorePage', 'Admin check result', data);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        logger.error('MorePage', 'Error checking admin access', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [getUserId]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">More Options</h1>

      {/* Admin Panel */}
      {isAdmin && (
        <Card className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500"
            onClick={() => router.push('/admin')}
          >
            <Shield className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span>Admin Panel</span>
              <span className="text-xs text-muted-foreground">
                System management
              </span>
            </div>
          </Button>
        </Card>
      )}

      {/* Profile & Settings */}
      <Card className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => router.push('/profile')}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => router.push('/settings')}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </Card>

      {/* Info & Help */}
      <Card className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => router.push('/help')}
        >
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => router.push('/about')}
        >
          <Info className="h-5 w-5" />
          <span>About INFICO</span>
        </Button>
      </Card>

      {/* Logout */}
      <Card className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500"
          onClick={() => {
            // Здесь будет логика выхода
            logger.info('MorePage', 'User logged out');
          }}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </Card>
    </div>
  );
}
