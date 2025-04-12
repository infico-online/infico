'use client';

import {  Card, CardTitle  } from "@/components/ui/card";
import {  motion  } from "framer-motion";
import {  Wallet, BadgeDollarSign  } from "lucide-react";
import {  Investor  } from "@/types";

interface InvestorCardProps {
  investor: Investor;
}

function InvestorCard({ investor }: InvestorCardProps) {
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
              {investor.isWhale && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap">
                  WHALE
                </span>
              )}
              {investor.isAngel && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                  ANGEL
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-base pr-24">{investor.name}</CardTitle>
              
              <div className="text-xs text-muted-foreground">
                {investor.language} | {investor.interests.join(", ")}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3 w-3" />
                  <span>{investor.invested} USDT invested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BadgeDollarSign className="h-3 w-3" />
                  <span>{investor.activeIcos} active ICOs</span>
                </div>
              </div>

              <div className="flex justify-end">
                <span className="text-xs text-emerald-600">{investor.profit} USDT profit</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
