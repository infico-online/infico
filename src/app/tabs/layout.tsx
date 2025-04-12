'use client';

import {  Header  } from "@/components/shared/header";
import {  BottomNav  } from "@/components/shared/bottom-nav";
import {  motion, AnimatePresence  } from "framer-motion";
import {  useState, useEffect  } from "react";

export default function TabsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    let prevScroll = window.pageYOffset;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setShowNav(prevScroll > currentScroll);
      prevScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="pb-32">
        {children}
      </main>
      <AnimatePresence>
        {showNav && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-background"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
