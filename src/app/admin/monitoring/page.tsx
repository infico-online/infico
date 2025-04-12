'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Cpu,
  Activity,
  Database,
  Users,
  RefreshCcw,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  type LucideIcon
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  requests: number;
  activeUsers: number;
  responseTime: number;
  errors: number;
  uptime: number;
}

interface PerformanceData {
  createdAt: string;
  cpu: number;
  memory: number;
  requests: number;
}

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend?: number;
  className?: string;
}

export default function MonitoringPage() {
  const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(null);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Обновление каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const [metricsResponse, historyResponse] = await Promise.all([
        fetch('/api/admin/monitoring/current'),
        fetch('/api/admin/monitoring/history')
      ]);

      const metrics = await metricsResponse.json();
      const history = await historyResponse.json();

      setCurrentMetrics(metrics);
      setPerformanceHistory(history);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    trend = 0,
    className = "" 
  }: MetricCardProps) => (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">
            {value}
            <span className="text-base font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </h3>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {trend !== 0 && (
        <div className={`flex items-center mt-4 text-sm ${
          trend > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          <span>{Math.abs(trend)}% vs last hour</span>
        </div>
      )}
    </Card>
  );

  if (loading || !currentMetrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <Button onClick={fetchMetrics}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="CPU Usage"
          value={currentMetrics.cpu}
          unit="%"
          icon={Cpu}
          trend={5}
        />
        <MetricCard
          title="Memory Usage"
          value={currentMetrics.memory}
          unit="%"
          icon={Database}
          trend={-2}
        />
        <MetricCard
          title="Active Users"
          value={currentMetrics.activeUsers}
          unit="users"
          icon={Users}
          trend={12}
        />
        <MetricCard
          title="Response Time"
          value={currentMetrics.responseTime}
          unit="ms"
          icon={Activity}
        />
      </div>

      {/* System Health */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">System Health</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Uptime</p>
            <p className="text-2xl font-bold">
              {Math.floor(currentMetrics.uptime / 24)} days
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Error Rate</p>
            <p className="text-2xl font-bold">
              {((currentMetrics.errors / currentMetrics.requests) * 100).toFixed(2)}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Requests/min</p>
            <p className="text-2xl font-bold">{currentMetrics.requests}</p>
          </div>
        </div>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">CPU Usage History</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Memory Usage History</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#16a34a" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Active Alerts</h2>
        <div className="space-y-4">
          <div className="flex items-center text-yellow-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>High memory usage detected (85% utilized)</span>
          </div>
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>Increased error rate in payment processing</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
