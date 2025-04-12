'use client';

import {  useEffect, useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  Users, Wallet, BarChart, TrendingUp  } from "lucide-react";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  totalInvestors: number;
  averageInvestment: number;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
}

interface UsersAnalyticsProps {
  period: number;
}

export function UsersAnalytics({ period }: UsersAnalyticsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/admin/analytics/users?period=${period}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
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
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalUsers.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.activeUsers.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
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
              <Wallet className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Investment</p>
              <h3 className="text-2xl font-bold mt-1">{stats.averageInvestment.toLocaleString()} USDT</h3>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
              <BarChart className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Growth Trend</h3>
        <div className="space-y-4">
          {stats.userGrowth.map((point, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{point.date}</span>
              <span className="text-sm">{point.count.toLocaleString()} users</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
