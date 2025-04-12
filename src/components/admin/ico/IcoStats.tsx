'use client';

import {  Card  } from "@/components/ui/card";

interface IcoStatsProps {
  ico: {
    totalAmount: number;
    raisedAmount: number;
    investors: number;
    transactions: any[];
    createdAt: Date;
  };
}

function IcoStats({ ico }: IcoStatsProps) {
  const averageInvestment = ico.raisedAmount / ico.investors;
  const daysActive = Math.ceil((Date.now() - new Date(ico.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const dailyAverage = ico.raisedAmount / daysActive;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Avg Investment</p>
          <p className="text-lg font-medium">{averageInvestment.toLocaleString()} INFICO</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Daily Average</p>
          <p className="text-lg font-medium">{dailyAverage.toLocaleString()} INFICO</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Days Active</p>
          <p className="text-lg font-medium">{daysActive} days</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-lg font-medium">{ico.transactions.length}</p>
        </div>
      </div>
    </div>
  );
}
