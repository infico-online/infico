'use client';

import { useState, useCallback } from "react";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, Brush, ZoomOutMap } from "recharts";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Zoom, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";


interface DataPoint {
  createdAt: string;
  value: number;
  [key: string]: any;
}

interface InteractiveChartProps {
  title: string;
  data: DataPoint[]; 
  series: string[];
  type?: 'line' | 'bar';
}

function InteractiveChart({
  title,
  data,
  series,
  type = 'line'
}: InteractiveChartProps) {
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  const zoomIn = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    let leftIndex = data.findIndex(item => item.timestamp === refAreaLeft);
    let rightIndex = data.findIndex(item => item.timestamp === refAreaRight);

    if (leftIndex > rightIndex) {
      [leftIndex, rightIndex] = [rightIndex, leftIndex];
    }

    setLeft(data[leftIndex].timestamp);
    setRight(data[rightIndex].timestamp);
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setZoomLevel(prev => prev + 1);
  };

  const zoomOut = () => {
    setLeft(null);
    setRight(null);
    setZoomLevel(0);
  };

  const onMouseDown = useCallback((e: any) => {
    if (!e) return;
    setRefAreaLeft(e.activeLabel);
  }, []);

  const onMouseMove = useCallback((e: any) => {
    if (!e) return;
    if (refAreaLeft) setRefAreaRight(e.activeLabel);
  }, [refAreaLeft]);

  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <Card className="card-spacing">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            disabled={zoomLevel === 0}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refAreaLeft && zoomIn()}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              zoomOut();
              setRefAreaLeft(null);
              setRefAreaRight(null);
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={data}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={zoomIn}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              allowDataOverflow
              domain={[left || 'auto', right || 'auto']}
            />
            <YAxis allowDataOverflow />
            <Tooltip />
            <Legend />
            <Brush dataKey="timestamp" height={30} stroke="#8884d8" />

            {refAreaLeft && refAreaRight && (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            )}

            {series.map((serie, index) => (
              <DataComponent
                key={serie}
                type="monotone"
                dataKey={serie}
                stroke={`hsl(${index * 40}, 70%, 50%)`}
                fill={`hsl(${index * 40}, 70%, 50%)`}
                dot={false}
              />
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
