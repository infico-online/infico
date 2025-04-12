'use client';

import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer  } from "recharts";

interface IcoChartProps {
  data: {
    date: string;
    amount: number;
    investors: number;
  }[];
}

function IcoChart({ data }: IcoChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            name="Amount"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="investors"
            stroke="#82ca9d"
            name="Investors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
