import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Система логирования для серверной части приложения INFICO
 */
export class ServerLogger {
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
    // Здесь можно добавить сохранение лога в БД если нужно
  }

  /**
   * Логирование предупреждений
   */
  warn(module: string, message: string, data?: any): void {
    const logMessage = `[WARN] ${this.context}.${module}: ${message} ${data ? JSON.stringify(data) : ''}`;
    console.warn(logMessage);
    // Здесь можно добавить сохранение лога в БД если нужно
  }

  /**
   * Логирование ошибок
   */
  error(module: string, message: string, error?: any): void {
    const logMessage = `[ERROR] ${this.context}.${module}: ${message} ${error ? JSON.stringify(error) : ''}`;
    console.error(logMessage);
    // Здесь можно добавить сохранение лога в БД если нужно
  }

  /**
   * Логирование отладочной информации
   */
  debug(module: string, message: string, data?: any): void {
    if (process.env.NODE_ENV === 'production') return;
    const logMessage = `[DEBUG] ${this.context}.${module}: ${message} ${data ? JSON.stringify(data) : ''}`;
    console.debug(logMessage);
    // Здесь можно добавить сохранение лога в БД если нужно
  }
}

// Создаем экземпляр логгера для удобного импорта
export const serverLoggerInstance = new ServerLogger('Server'); 