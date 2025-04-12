'use client';

import {  useState  } from "react";
import {  Card  } from "@/components/ui/card";
import {  Button  } from "@/components/ui/button";
import {  Input  } from "@/components/ui/input";
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import {  ReportConfig, reportGenerator  } from "@/lib/reportGenerator";

function ReportScheduler() {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recipients, setRecipients] = useState('');
  const [format, setFormat] = useState<'excel' | 'csv' | 'json'>('excel');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: ReportConfig = {
      name,
      frequency,
      format,
      recipients: recipients.split(',').map(email => email.trim()),
      data: async () => {
        // Здесь добавить логику получения данных для отчета
        return [];
      }
    };

    reportGenerator.addReport(config);
    
    // Сброс формы
    setName('');
    setRecipients('');
  };

  return (
    <Card className="card-spacing">
      <h3 className="font-medium mb-4">Schedule Automated Report</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monthly User Statistics"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Frequency</label>
          <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <Select value={format} onValueChange={(v: any) => setFormat(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Recipients (comma-separated)</label>
          <Input
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="admin@example.com, manager@example.com"
          />
        </div>

        <Button type="submit" className="w-full">
          Schedule Report
        </Button>
      </form>
    </Card>
  );
}
