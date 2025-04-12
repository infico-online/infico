'use client';

import React, { createContext, useEffect, useState, ReactNode, Suspense } from 'react';
import { loggerInstance as logger } from '@/lib/logger';
import { type TelegramWebApp, type TelegramWebAppEvent, type TelegramEventHandler } from '@/types/telegram';

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramWebApp['initDataUnsafe']['user'] | null;
  isInTelegram: boolean;
  isReady: boolean;
  error: Error | null;
}

export const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isInTelegram: false,
  isReady: false,
  error: null,
});

interface TelegramProviderProps {
  children: ReactNode;
}

function TelegramProviderContent({ children, webApp, user, isReady, error }: TelegramProviderProps & TelegramContextType) {
  const value = React.useMemo(
    () => ({
      webApp,
      user,
      isInTelegram: !!webApp,
      isReady,
      error,
    }),
    [webApp, user, isReady, error]
  );

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramWebApp['initDataUnsafe']['user'] | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeTelegram = () => {
      try {
        if (typeof window === 'undefined') {
          logger.warn('TelegramProvider', 'Window is not defined');
          return;
        }

        if (!window.Telegram?.WebApp) {
          logger.warn('TelegramProvider', 'Telegram WebApp is not available');
          return;
        }

        const app = window.Telegram.WebApp as TelegramWebApp;
        app.ready();
        app.expand();
        
        const handleViewportChanged: TelegramEventHandler = () => {
          logger.info('TelegramProvider', 'Viewport changed');
        };

        const handleMainButtonClick: TelegramEventHandler = () => {
          logger.info('TelegramProvider', 'Main button clicked');
        };

        const handleBackButtonClick: TelegramEventHandler = () => {
          logger.info('TelegramProvider', 'Back button clicked');
        };

        app.onEvent('viewportChanged', handleViewportChanged);
        app.onEvent('mainButtonClicked', handleMainButtonClick);
        app.onEvent('backButtonClicked', handleBackButtonClick);
        
        setWebApp(app);
        setUser(app.initDataUnsafe.user || null);
        logger.info('TelegramProvider', 'Telegram WebApp initialized', {
          userId: app.initDataUnsafe.user?.id,
        });

        app.enableClosingConfirmation();

        return () => {
          app.offEvent('viewportChanged', handleViewportChanged);
          app.offEvent('mainButtonClicked', handleMainButtonClick);
          app.offEvent('backButtonClicked', handleBackButtonClick);
          app.disableClosingConfirmation();
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize Telegram WebApp');
        setError(error);
        logger.error('TelegramProvider', 'Failed to initialize Telegram WebApp', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeTelegram();
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <div className="text-center">Инициализация Telegram...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <div className="text-center">Загрузка...</div>
      </div>
    }>
      <TelegramProviderContent
        webApp={webApp}
        user={user}
        isReady={isReady}
        error={error}
      >
        {children}
      </TelegramProviderContent>
    </Suspense>
  );
}
