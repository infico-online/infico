'use client';

import {  Card, CardTitle  } from "@/components/ui/card";
import {  motion  } from "framer-motion";
import {  Users, Eye, TrendingUp  } from "lucide-react";
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
      <Card className="card-hover p-4">
        <div className="relative">
          <div className="absolute right-0 top-0 flex flex-col items-end gap-1">
            {page.isPremium && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                PREMIUM
              </span>
            )}
            {page.isAngel && !page.hasIco && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                ANGEL
              </span>
            )}
            {page.hasIco && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                Active ICO
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-base pr-28 mb-2">{page.name}</CardTitle>
            <div className="text-xs text-muted-foreground mb-2">
              {page.category}/{page.language}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3" />
                <span>{page.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>{page.subscribers} subscribers</span>
              </div>
              <div className="ml-auto flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+{page.growth}% weekly</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
