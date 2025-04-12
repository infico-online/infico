'use client';

import { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { TelegramProvider } from '@/components/TelegramProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <TelegramProvider>
        {children}
      </TelegramProvider>
    </NextThemesProvider>
  );
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
