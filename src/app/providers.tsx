'use client';

import * as React from "react";
import { TelegramProvider } from "@/components/TelegramProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AdminProvider } from "@/context/AdminContext";
import { Toaster } from "@/components/ui/toaster";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <TelegramProvider>
        <ThemeProvider defaultTheme="light" storageKey="infico-theme">
          <AdminProvider>
            {children}
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </TelegramProvider>
    </React.Suspense>
  );
}

export { Providers };
