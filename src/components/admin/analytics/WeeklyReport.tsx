'use client';

import {  useEffect, useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  TrendingUp, DollarSign, Users, Radio  } from "lucide-react";

interface WeeklyReportProps {
  period: number;
}

interface WeeklyStats {
  userGrowth: number;
  revenueGrowth: number;
  newChannels: number;
  activeICOs: number;
  topPerformers: {
    channels: Array<{ name: string; growth: number }>;
    icos: Array<{ name: string; raised: number }>;
  };
}

export function WeeklyReport({ period }: WeeklyReportProps) {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const response = await fetch(`/api/admin/analytics/weekly?period=${period}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyStats();
  }, [period]);

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Growth Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">User Growth</p>
              <h3 className="text-2xl font-bold mt-1">{stats.userGrowth}%</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenue Growth</p>
              <h3 className="text-2xl font-bold mt-1">{stats.revenueGrowth}%</h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Channels</p>
              <h3 className="text-2xl font-bold mt-1">{stats.newChannels}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Radio className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active ICOs</p>
              <h3 className="text-2xl font-bold mt-1">{stats.activeICOs}</h3>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Growing Channels</h3>
          <div className="space-y-4">
            {stats.topPerformers.channels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{channel.name}</span>
                <span className="text-sm text-green-600">+{channel.growth}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing ICOs</h3>
          <div className="space-y-4">
            {stats.topPerformers.icos.map((ico, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{ico.name}</span>
                <span className="text-sm">{ico.raised.toLocaleString()} INFICO</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Growth Trends</h3>
          {/* График роста */}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
          {/* График распределения доходов */}
        </Card>
      </div>
    </div>
  );
}
