'use client';

import {  Card, CardTitle  } from "@/components/ui/card";
import {  motion  } from "framer-motion";
import {  Wallet, TrendingUp, BadgeDollarSign  } from "lucide-react";
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
      <Card className="card-hover p-4">
        <div className="relative">
          <div className="absolute right-0 top-0 flex flex-col items-end gap-1">
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
          <div>
            <CardTitle className="text-base pr-28 mb-2">{investor.name}</CardTitle>
            <div className="text-xs text-muted-foreground mb-2">
              {investor.language} | {investor.interests.join(", ")}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="h-3 w-3" />
                <span>{investor.invested} USDT invested</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BadgeDollarSign className="h-3 w-3" />
                <span>{investor.activeIcos} active ICOs</span>
                <div className="ml-auto flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>{investor.profit} USDT profit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
