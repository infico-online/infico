'use client';

import {  useAdminMonitoring  } from "@/hooks/use-admin-monitoring";
import {  Card  } from "@/components/ui/card";
import {  AdminChart  } from "../charts/AdminChart";
import {  AlertTriangle, CheckCircle  } from "lucide-react";
import {  motion  } from "framer-motion";

function MonitoringPanel() {
  import {  data, loading  } from useAdminMonitoring(;

  if (loading) {
    return <div className="text-center p-4">Loading monitoring data...</div>;
  }

  return (
    <div className="content-wrapper section-spacing">
      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="card-spacing flex items-center justify-between">
          <div>
            <h3 className="font-medium">System Status</h3>
            <p className="text-sm text-muted-foreground">Current state</p>
          </div>
          {data?.status === 'healthy' ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          )}
        </Card>

        <Card className="card-spacing">
          <h3 className="font-medium">Errors (24h)</h3>
          <p className="text-2xl font-bold">{data?.metrics.errors24h}</p>
        </Card>

        <Card className="card-spacing">
          <h3 className="font-medium">Active Users (24h)</h3>
          <p className="text-2xl font-bold">{data?.metrics.activeUsers24h}</p>
        </Card>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminChart
          title="System Performance"
          data={data?.systemMetrics.map(m => ({
            name: new Date(m.createdAt).toLocaleTimeString(),
            value: m.value
          })) || []}
        />

        <AdminChart
          title="Admin Actions"
          type="bar"
          data={data?.lastActions.map(a => ({
            name: new Date(a.createdAt).toLocaleTimeString(),
            value: 1
          })) || []}
          color="hsl(var(--destructive))"
        />
      </div>

      {/* Recent Activity */}
      <Card className="card-spacing">
        <h3 className="font-medium mb-4">Recent Admin Actions</h3>
        <div className="space-y-2">
          {data?.lastActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted"
            >
              <div>
                <p className="text-sm font-medium">{action.action}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(action.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`text-xs ${
                action.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'
              }`}>
                {action.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
