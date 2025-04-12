'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Clock, TrendingUp } from "lucide-react";

export interface IcoStatsProps {
  totalInvestment?: number;
  investors?: number;
  daysRemaining?: number;
  growthRate?: number;
  status?: string;
  icoId?: string;
}

export function IcoStats({
  totalInvestment = 0,
  investors = 0,
  daysRemaining = 0,
  growthRate = 0,
  status = 'Active',
  icoId = ''
}: IcoStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Общие инвестиции</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {growthRate > 0 ? '+' : ''}{growthRate}% с прошлой недели
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Инвесторы</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{investors}</div>
          <p className="text-xs text-muted-foreground">Активных инвесторов</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Оставшееся время</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysRemaining} дней</div>
          <p className="text-xs text-muted-foreground">До окончания ICO</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Рост</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{growthRate}%</div>
          <p className="text-xs text-muted-foreground">
            Статус: <span className="font-medium">{status}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
