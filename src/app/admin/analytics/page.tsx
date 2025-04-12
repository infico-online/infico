'use client';

import { useState } from "react";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Calendar, Download, Share2 } from "lucide-react";

import { DailyReport } from "@/components/admin/analytics/DailyReport";

import { WeeklyReport } from "@/components/admin/analytics/WeeklyReport";

import { UsersAnalytics } from "@/components/admin/analytics/UsersAnalytics";

import { IcoPerformance } from "@/components/admin/analytics/IcoPerformance";

import { ChannelPerformance } from "@/components/admin/analytics/ChannelPerformance";


type ReportType = 'daily' | 'weekly' | 'users' | 'ico' | 'channels';

export default function AnalyticsPage() {
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [dateRange, setDateRange] = useState('30');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[
          { key: 'daily', label: 'Daily Report' },
          { key: 'weekly', label: 'Weekly Report' },
          { key: 'users', label: 'Users Analytics' },
          { key: 'ico', label: 'ICO Performance' },
          { key: 'channels', label: 'Channel Analytics' }
        ].map((type) => (
          <Button
            key={type.key}
            variant={reportType === type.key ? 'default' : 'outline'}
            onClick={() => setReportType(type.key as ReportType)}
            className="w-full"
          >
            {type.label}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {reportType === 'daily' && <DailyReport period={parseInt(dateRange)} />}
        {reportType === 'weekly' && <WeeklyReport period={parseInt(dateRange)} />}
        {reportType === 'users' && <UsersAnalytics period={parseInt(dateRange)} />}
        {reportType === 'ico' && <IcoPerformance period={parseInt(dateRange)} />}
        {reportType === 'channels' && <ChannelPerformance period={parseInt(dateRange)} />}
      </div>
    </div>
  );
}
