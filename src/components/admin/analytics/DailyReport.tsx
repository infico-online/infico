'use client';

import {  useEffect, useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  
  Users, Package, Radio, TrendingUp, ArrowUpRight, 
  DollarSign, Shield 
 } from 'lucide-react';

interface DailyReportProps {
  period: number;
}

interface DailyStats {
  newUsers: number;
  activeUsers: number;
  totalTransactions: number;
  transactionVolume: number;
  activeICOs: number;
  newChannels: number;
  securityEvents: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export function DailyReport({ period }: DailyReportProps) {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyStats = async () => {
      try {
        const response = await fetch(`/api/admin/analytics/daily?period=${period}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching daily stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyStats();
  }, [period]);

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {/* User Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.newUsers}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+{stats.activeUsers} active today</span>
          </div>
        </Card>

        {/* Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.transactionVolume.toLocaleString()} INFICO
              </h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>{stats.totalTransactions} transactions</span>
          </div>
        </Card>

        {/* ICOs & Channels */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active ICOs</p>
              <h3 className="text-2xl font-bold mt-1">{stats.activeICOs}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <Radio className="h-4 w-4 mr-1" />
            <span>+{stats.newChannels} new channels</span>
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Health</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.systemHealth === 'healthy' ? 'Healthy' : 'Warning'}
              </h3>
            </div>
            <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-orange-600">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>{stats.securityEvents} security events</span>
          </div>
        </Card>
      </div>

      {/* Здесь будут графики */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Activity</h3>
          {/* График активности пользователей */}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Volume</h3>
          {/* График объема транзакций */}
        </Card>
      </div>
    </div>
  );
}
