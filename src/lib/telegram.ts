'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: string) => void;
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: string;
          hash: string;
        };
      };
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<typeof window.Telegram.WebApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setWebApp(window.Telegram.WebApp);
      window.Telegram.WebApp.ready();
    }
  }, []);

  const getUserId = () => {
    if (!webApp) return null;
    return webApp.initDataUnsafe?.user?.id;
  };

  return {
    webApp,
    getUserId,
  };
} 