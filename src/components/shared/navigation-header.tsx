'use client';

import {  useRouter  } from "next/navigation";
import {  Button  } from "@/components/ui/button";
import {  ChevronLeft, Home  } from "lucide-react";

export function NavigationHeader({ title }: { title: string }) {
  const router = useRouter();
  
  return (
    <div className="flex justify-between items-center p-3 border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-medium">{title}</h1>
      <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
        <Home className="h-5 w-5" />
      </Button>
    </div>
  );
}
