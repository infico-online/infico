'use client';

import {  Twitter, Send, Youtube, Instagram  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  SettingsPopup  } from "./settings-popup";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-bold sm:text-2xl">
            infico<span className="text-muted-foreground">.online</span>
          </h1>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {[Twitter, Send, Youtube, Instagram].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon" className="h-8 w-8">
                <Icon className="h-4 w-4" />
                <span className="sr-only">Social Link {i + 1}</span>
              </Button>
            ))}
            <SettingsPopup />
          </nav>
        </div>
      </div>
    </header>
  );
}
