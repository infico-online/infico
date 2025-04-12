'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Card } from "@/components/ui/card";


interface ChartData {
  name: string;
  value: number;
}

interface AdminChartProps {
  title: string;
  data: ChartData[]; 
  type?: 'line' | 'bar';
  color?: string;
  height?: number;
}

function AdminChart({
  title,
  data,
  type = 'line',
  color = 'hsl(var(--primary))',
  height = 300
}: AdminChartProps) {
  const Chart = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <Card className="card-spacing">
      <h3 className="font-medium mb-4">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <DataComponent
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
            />
          </Chart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
