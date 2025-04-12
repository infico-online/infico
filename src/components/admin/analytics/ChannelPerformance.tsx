'use client';

import {  useEffect, useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  BarChart, TrendingUp, Users, Radio  } from "lucide-react";

interface ChannelStats {
  totalViews: number;
  avgGrowth: number;
  totalSubscribers: number;
  activeChannels: number;
  topChannels: Array<{
    name: string;
    views: number;
    growth: number;
  }>;
}

interface ChannelPerformanceProps {
  period: number;
}

export function ChannelPerformance({ period }: ChannelPerformanceProps) {
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/admin/analytics/channels?period=${period}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching channel stats:', error);
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
              <p className="text-sm text-muted-foreground">Total Views</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalViews.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
              <BarChart className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Growth</p>
              <h3 className="text-2xl font-bold mt-1">{stats.avgGrowth}%</h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalSubscribers.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Channels</p>
              <h3 className="text-2xl font-bold mt-1">{stats.activeChannels}</h3>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
              <Radio className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Channels</h3>
        <div className="space-y-4">
          {stats.topChannels.map((channel, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{channel.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm">{channel.views.toLocaleString()} views</span>
                <span className="text-sm text-green-600">+{channel.growth}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
