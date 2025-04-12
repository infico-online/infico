'use client';

import {  useState  } from "react";
import {  Button  } from "@/components/ui/button";
import {  Download  } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
 } from '@/components/ui/dropdown-menu';
import {  exportToCSV, exportToJSON, exportToExcel  } from "@/lib/exportUtils";

interface ExportButtonProps {
  data: any[]; 
  filename: string;
  className?: string;
}

function ExportButton({ data, filename, className }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'csv' | 'json' | 'excel') => {
    setLoading(true);
    try {
      switch (format) {
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'excel':
          await exportToExcel(data, filename);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          disabled={loading}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
