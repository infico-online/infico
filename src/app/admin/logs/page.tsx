'use client';

import { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Search, Download, Trash2 } from "lucide-react";

import { logger } from "@/lib/logger";

import { LogsActivity } from "@/components/admin/logs/LogsActivity";


const LOG_LEVELS = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'] as const;
type LogLevel = typeof LOG_LEVELS[number];

interface LogEntry {
  id: string;
  level: LogLevel;
  context: string;
  message: string;
  createdAt: string;
  data?: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<LogLevel>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      logger.error('AdminLogs', 'Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/logs/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      logger.error('AdminLogs', 'Failed to export logs', error);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to clean up logs older than 30 days?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/logs/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 30 })
      });

      if (!response.ok) throw new Error('Failed to clean up logs');
      
      const data = await response.json();
      alert(`Successfully cleaned up ${data.deletedCount} logs`);
      fetchLogs();
    } catch (error) {
      logger.error('AdminLogs', 'Failed to clean up logs', error);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesSearch = (
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.context.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesLevel && matchesSearch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" onClick={handleCleanup}>
            <Trash2 className="h-4 w-4 mr-2" />
            Cleanup Old
          </Button>
        </div>
      </div>

      <LogsActivity logs={logs} />

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={levelFilter} onValueChange={(value: LogLevel) => setLevelFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            {LOG_LEVELS.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="border-b last:border-0 pb-4 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <span className={`font-medium ${
                  log.level === 'ERROR' ? 'text-red-500' :
                  log.level === 'WARN' ? 'text-yellow-500' :
                  log.level === 'INFO' ? 'text-blue-500' :
                  'text-gray-500'
                }`}>
                  {log.level}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  [{log.context}]
                </span>
              </div>
              <p className="mt-1 text-sm">{log.message}</p>
              {log.data && (
                <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">
                  {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
