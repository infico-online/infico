'use client';

import {  useRouter  } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl mx-auto pb-20">
        {children}
      </div>
    </div>
  );
}
