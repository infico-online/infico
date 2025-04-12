'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  Radio, 
  Package, 
  Users, 
  Download,
  Share2,
  TrendingUp
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('30');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        
        <div className="flex gap-4">
          <Select value={period} onValueChange={setPeriod}>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Channels Card */}
        <Card className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Channels</p>
              <h3 className="text-2xl font-bold mt-2">350</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Radio className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+15.5%</span>
          </div>
        </Card>

        {/* Active ICO Card */}
        <Card className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active ICO</p>
              <h3 className="text-2xl font-bold mt-2">25</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8.2%</span>
          </div>
        </Card>

        {/* Volume Card */}
        <Card className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">INFICO Volume</p>
              <h3 className="text-2xl font-bold mt-2">150K</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12.3%</span>
          </div>
        </Card>

        {/* Users Card */}
        <Card className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <h3 className="text-2xl font-bold mt-2">2.5K</h3>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+21.7%</span>
          </div>
        </Card>
      </div>

      {/* Explore Buttons */}
      <div className="grid grid-cols-1 gap-4">
        <Button variant="default" size="lg">
          EXPLORE TOKEN OPERATIONS
        </Button>
        <Button variant="default" size="lg">
          EXPLORE CHANNEL PERFORMANCE
        </Button>
        <Button variant="default" size="lg">
          EXPLORE ICO PERFORMANCE
        </Button>
        <Button variant="default" size="lg">
          EXPLORE USERS
        </Button>
      </div>

      {/* Report Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" size="lg">
          DAILY REPORT
        </Button>
        <Button variant="outline" size="lg">
          WEEKLY REPORT
        </Button>
      </div>

      <Button className="w-full" size="lg">
        FULL ANALYTICS REPORT
      </Button>
    </div>
  );
}