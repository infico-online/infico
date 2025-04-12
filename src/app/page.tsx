'use client';

import { useEffect, Suspense } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentCard } from "@/components/cards/ContentCard";
import { ActionButtons } from "@/components/shared/action-buttons";
import { useHomeData } from "@/hooks/use-home-data";
import { useTelegram } from "@/hooks/use-telegram";

function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <div className="text-center">Загрузка...</div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: Error | string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="text-red-500 text-center">
        {error instanceof Error ? error.message : error}
      </div>
      <Button 
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Попробовать снова
      </Button>
    </div>
  );
}

function HomeContent() {
  const { webApp, user, loading: telegramLoading, isInTelegram, error: telegramError } = useTelegram();
  const { data, loading: dataLoading, error: dataError } = useHomeData();

  useEffect(() => {
    if (isInTelegram && webApp) {
      const mainButton = webApp.MainButton;
      if (mainButton) {
        mainButton.text = "Открыть меню";
        mainButton.show();
        mainButton.onClick(() => {
          webApp.expand();
        });
      }
    }
  }, [isInTelegram, webApp]);

  if (telegramLoading || dataLoading) {
    return <LoadingSpinner />;
  }

  if (telegramError || dataError) {
    return <ErrorDisplay error={telegramError || dataError || 'Неизвестная ошибка'} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 container max-w-lg mx-auto py-4 px-4">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {isInTelegram ? 'Открыто в Telegram' : 'Открыто в браузере'}
            {user?.id && ` • ID: ${user.id}`}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input className="pl-10" placeholder="Поиск..." />
          </div>
          
          <ActionButtons />
          
          <div className="grid gap-4">
            {data?.icos?.map((ico, index) => (
              <ContentCard key={index} {...ico} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}
