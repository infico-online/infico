'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, RadarChart, Radar, PolarGrid, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarAngleAxis, PolarRadiusAxis } from "recharts";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";


type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'radar';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface AdvancedChartProps {
  title: string;
  data: ChartData[]; 
  type: ChartType;
  className?: string;
  height?: number;
  colors?: string[];
  series?: string[];
}

function AdvancedChart({
  title,
  data,
  type,
  className,
  height = 300,
  colors = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--accent))'],
  series = ['value']
}: AdvancedChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((serie, index) => (
              <Line
                key={serie}
                type="monotone"
                dataKey={serie}
                stroke={colors[index % colors.length]}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((serie, index) => (
              <Bar
                key={serie}
                dataKey={serie}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((serie, index) => (
              <Area
                key={serie}
                type="monotone"
                dataKey={serie}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={colors[0]}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            {series.map((serie, index) => (
              <Radar
                key={serie}
                name={serie}
                dataKey={serie}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
            <Legend />
          </RadarChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("card-spacing", className)}>
      <h3 className="font-medium mb-4">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
