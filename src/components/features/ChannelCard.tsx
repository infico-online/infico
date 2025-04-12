'use client';

import {  Card, CardTitle  } from "@/components/ui/card";
import {  motion  } from "framer-motion";
import {  Users, TrendingUp  } from "lucide-react";
import {  Channel  } from "@/types";

interface ChannelCardProps {
  channel: Channel;
}

function ChannelCard({ channel }: ChannelCardProps) {
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
            {channel.isPremium && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                PREMIUM
              </span>
            )}
            {channel.isAngel && !channel.hasIco && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                ANGEL
              </span>
            )}
            {channel.hasIco && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                Active ICO
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-base pr-28 mb-2">{channel.name}</CardTitle>
            <div className="text-xs text-muted-foreground mb-2">
              {channel.category}/{channel.language}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {channel.postsPerDay} posts per day
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{channel.followers} followers</span>
              <div className="ml-auto flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+{channel.growth}% weekly</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
