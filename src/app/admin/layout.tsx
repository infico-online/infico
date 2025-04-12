'use client';

import {  AdminHeader  } from "@/components/admin/AdminHeader";
import {  AdminSidebar  } from "@/components/admin/AdminSidebar";
import {  ThemeToggle  } from "@/components/admin/ThemeToggle";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <AdminHeader />
            <ThemeToggle />
          </div>
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
