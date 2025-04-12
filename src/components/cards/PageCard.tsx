'use client';

import {  Card, CardTitle  } from "@/components/ui/card";
import {  motion  } from "framer-motion";
import {  Users, Eye  } from "lucide-react";
import {  Page  } from "@/types";

interface PageCardProps {
  page: Page;
}

function PageCard({ page }: PageCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover">
        <div className="p-3">
          <div className="relative">
            <div className="absolute right-0 top-0 flex gap-1">
              {page.isPremium && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                  PREMIUM
                </span>
              )}
              {page.hasIco && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                  Active ICO
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-base pr-24">{page.name}</CardTitle>
              
              <div className="text-xs text-muted-foreground">
                {page.category}/{page.language}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>{page.views} views</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{page.subscribers} subscribers</span>
                </div>
              </div>

              <div className="flex justify-end">
                <span className="text-xs text-emerald-600">+{page.growth}% weekly</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
