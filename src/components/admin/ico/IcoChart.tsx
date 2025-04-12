'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Пример данных для графика
const data = [
  { name: 'День 1', amount: 0 },
  { name: 'День 2', amount: 400 },
  { name: 'День 3', amount: 800 },
  { name: 'День 4', amount: 1200 },
  { name: 'День 5', amount: 1600 },
  { name: 'День 6', amount: 2000 },
  { name: 'День 7', amount: 2400 },
];

export interface IcoChartProps {
  icoId?: string;
  data?: Array<{ name: string; amount: number }>;
}

export function IcoChart({ icoId, data: customData }: IcoChartProps) {
  const chartData = customData || data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Инвестиции ICO {icoId && `#${icoId}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
