'use client';

import {  useEffect, useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  Gem, TrendingUp, Users, DollarSign  } from "lucide-react";

interface IcoStats {
  totalRaised: number;
  activeICOs: number;
  totalInvestors: number;
  averageReturn: number;
  topICOs: Array<{
    name: string;
    raised: number;
    investors: number;
  }>;
}

interface IcoPerformanceProps {
  period: number;
}

export function IcoPerformance({ period }: IcoPerformanceProps) {
  const [stats, setStats] = useState<IcoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/admin/analytics/icos?period=${period}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching ICO stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalRaised.toLocaleString()} USDT</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active ICOs</p>
              <h3 className="text-2xl font-bold mt-1">{stats.activeICOs}</h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
              <Gem className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Investors</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalInvestors.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Return</p>
              <h3 className="text-2xl font-bold mt-1">{stats.averageReturn}%</h3>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top ICOs</h3>
        <div className="space-y-4">
          {stats.topICOs.map((ico, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{ico.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm">{ico.raised.toLocaleString()} USDT</span>
                <span className="text-sm text-muted-foreground">{ico.investors} investors</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
