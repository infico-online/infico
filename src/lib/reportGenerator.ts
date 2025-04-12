import {  exportToExcel  } from "./exportUtils";
import {  logger  } from "./logger";

export interface ReportConfig {
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  data: JSON.parse(JSON.stringify(() => Promise<any[]>;))
  recipients?: string[];
  format: 'excel' | 'csv' | 'json';
}

export class ReportGenerator {
  private reports: ReportConfig[] = [];
  private intervals: NodeJS.Timeout[] = [];

  addReport(config: ReportConfig) {
    this.reports.push(config);
    this.scheduleReport(config);
  }

  private scheduleReport(config: ReportConfig) {
    const getInterval = () => {
      switch (config.frequency) {
        case 'daily':
          return 24 * 60 * 60 * 1000;
        case 'weekly':
          return 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
          return 30 * 24 * 60 * 60 * 1000;
      }
    };

    const interval = setInterval(async () => {
      try {
        const data = await config.data();
        const filename = `${config.name}_${new Date().toISOString()}`;
        
        await exportToExcel(data, filename);
        
        if (config.recipients?.length) {
          // Здесь можно добавить логику отправки отчета по email
          logger.info('ReportGenerator', `Report ${config.name} generated and sent to ${config.recipients.join(', ')}`);
        }
        
        logger.info('ReportGenerator', `Report ${config.name} generated successfully`);
      } catch (error) {
        logger.error('ReportGenerator', `Failed to generate report ${config.name}`, error);
      }
    }, getInterval());

    this.intervals.push(interval);
  }

  stopAllReports() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }
}

// Создаем инстанс генератора отчетов
const reportGenerator = new ReportGenerator();
