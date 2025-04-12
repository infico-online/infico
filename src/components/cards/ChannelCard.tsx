'use client';

import {  Card, CardTitle  } from "@/components/ui/card";
import {  motion  } from "framer-motion";
import {  Users  } from "lucide-react";
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
      <Card className="card-hover">
        <div className="p-3">
          <div className="relative">
            <div className="absolute right-0 top-0 flex gap-1">
              {channel.isPremium && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                  PREMIUM
                </span>
              )}
              {channel.hasIco && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                  Active ICO
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-base pr-24">{channel.name}</CardTitle>
              
              <div className="text-xs text-muted-foreground">
                {channel.category}/{channel.language}
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{channel.followers} followers</span>
                <span className="mx-2">•</span>
                <span>{channel.postsPerDay} posts/day</span>
              </div>

              <div className="flex justify-end">
                <span className="text-xs text-emerald-600">+{channel.growth}% weekly</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
