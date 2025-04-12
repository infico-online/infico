'use client';

import {  Button  } from "@/components/ui/button";
import {  useRouter  } from "next/navigation";
import {  Home, User, MessageCircle, MoreHorizontal  } from "lucide-react";

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Cabinet', icon: User, path: '/cabinet' },
  { name: 'Channels', icon: MessageCircle, path: '/channels' },
  { name: 'More', icon: MoreHorizontal, path: '/more' }
];

function BottomNav() {
  const router = useRouter();

  return (
    <nav className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-0.5 h-12 px-3 py-2 hover:bg-accent"
              onClick={() => router.push(item.path)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
