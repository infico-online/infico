'use client';

import { useContext } from 'react';
import { TelegramContext } from '@/components/TelegramProvider';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date?: number;
          hash?: string;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
      };
    };
  }
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }

  if (context.error) {
    throw context.error;
  }

  return {
    webApp: context.webApp,
    user: context.user,
    loading: !context.isReady,
    error: context.error,
    isInTelegram: context.isInTelegram,
    isAdmin: context.user?.id === 414880710
  };
}
