'use client';

import {  Moon, Sun  } from "lucide-react";
import {  Button  } from "@/components/ui/button";
import {  useEffect, useState  } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9"
    >
      {theme === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
