'use client';

/**
 * Система логирования для клиентской части приложения INFICO
 */
export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Логирование информационных сообщений
   */
  info(module: string, message: string, data?: any): void {
    const logMessage = `[INFO] ${this.context}.${module}: ${message} ${data ? JSON.stringify(data) : ''}`;
    console.log(logMessage);
  }

  /**
   * Логирование предупреждений
   */
  warn(module: string, message: string, data?: any): void {
    const logMessage = `[WARN] ${this.context}.${module}: ${message} ${data ? JSON.stringify(data) : ''}`;
    console.warn(logMessage);
  }

  /**
   * Логирование ошибок
   */
  error(module: string, message: string, error?: any): void {
    const logMessage = `[ERROR] ${this.context}.${module}: ${message} ${error ? JSON.stringify(error) : ''}`;
    console.error(logMessage);
  }

  /**
   * Логирование отладочной информации
   */
  debug(module: string, message: string, data?: any): void {
    if (process.env.NODE_ENV === 'production') return;
    const logMessage = `[DEBUG] ${this.context}.${module}: ${message} ${data ? JSON.stringify(data) : ''}`;
    console.debug(logMessage);
  }
}

// Создаем экземпляр логгера для удобного импорта
export const loggerInstance = new Logger('Client');

// Экспортируем экземпляр логгера как logger для обратной совместимости
export const logger = loggerInstance;
