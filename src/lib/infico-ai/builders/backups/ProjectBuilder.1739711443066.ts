import type { Anthropic } from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';

interface SelfHealingConfig {
  maxAttempts: number;
  backupInterval: number;
  healingStrategies: {
    [key: string]: (error: Error) => Promise<boolean>;
  };
}

class SelfHealingBuilder {
  private readonly config: SelfHealingConfig = {
    maxAttempts: 3,
    backupInterval: 5 * 60 * 1000, // 5 минут
    healingStrategies: {
      'JSON_PARSE': async (error) => {
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
          console.log('🔄 Применяем стратегию исправления JSON');
          
          // Попытка исправить JSON
          const response = await this.anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 4096,
            messages: [{
              role: "user",
              content: `Fix this JSON parsing error: ${error.message}`
            }]
          });

          try {
            const fixedJson = JSON.parse(response.content[0].text);
            return true;
          } catch {
            return false;
          }
        }
        return false;
      },
      'SYNTAX_ERROR': async (error) => {
        if (error instanceof SyntaxError) {
          console.log('🔄 Применяем стратегию исправления синтаксиса');
          
          const response = await this.anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 4096,
            messages: [{
              role: "user",
              content: `Fix this TypeScript syntax error: ${error.message}`
            }]
          });

          // Применяем исправления
          return true;
        }
        return false;
      }
    }
  };

  private lastBackup: number = 0;

  constructor(private readonly anthropic: Anthropic) {
    this.setupAutoBackup();
    this.setupErrorHandling();
  }

  private setupAutoBackup() {
    setInterval(() => {
      this.createBackup();
    }, this.config.backupInterval);
  }

  private setupErrorHandling() {
    process.on('uncaughtException', async (error) => {
      console.log('🔴 Перехвачена необработанная ошибка');
      await this.handleError(error);
    });

    process.on('unhandledRejection', async (error) => {
      console.log('🔴 Перехвачено необработанное отклонение промиса');
      await this.handleError(error as Error);
    });
  }

  private async handleError(error: Error): Promise<boolean> {
    console.log(`🔍 Анализ ошибки: ${error.message}`);

    // Перебираем все стратегии исправления
    for (const [strategyName, strategy] of Object.entries(this.config.healingStrategies)) {
      try {
        const fixed = await strategy(error);
        if (fixed) {
          console.log(`✅ Успешно применена стратегия: ${strategyName}`);
          return true;
        }
      } catch (healingError) {
        console.error(`❌ Ошибка при применении стратегии ${strategyName}:`, healingError);
      }
    }

    // Если ни одна стратегия не сработала, пробуем общий подход
    return this.applyGeneralHealing(error);
  }

  private async applyGeneralHealing(error: Error): Promise<boolean> {
    console.log('🔄 Применяем общую стратегию исправления');

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `
            You are a TypeScript error fixing assistant. 
            Fix this error in the ProjectBuilder.ts file:
            Error: ${error.message}
            Stack: ${error.stack}
            
            Provide only the fixed code without any explanation.
          `
        }]
      });

      const fixedCode = response.content[0].text;
      
      // Создаем бэкап перед применением исправлений
      await this.createBackup();

      // Применяем исправления
      await fs.writeFile(
        path.resolve(process.cwd(), 'src/lib/infico-ai/builders/ProjectBuilder.ts'),
        fixedCode
      );

      return true;
    } catch (healingError) {
      console.error('❌ Ошибка при общем исправлении:', healingError);
      return false;
    }
  }

  private async createBackup(): Promise<void> {
    const now = Date.now();
    if (now - this.lastBackup >= this.config.backupInterval) {
      const backupPath = path.resolve(
        process.cwd(),
        'src/lib/infico-ai/builders/backups',
        `ProjectBuilder.${now}.ts`
      );

      await fs.ensureDir(path.dirname(backupPath));
      await fs.copy(
        path.resolve(process.cwd(), 'src/lib/infico-ai/builders/ProjectBuilder.ts'),
        backupPath
      );

      this.lastBackup = now;
      console.log(`📦 Создан бэкап: ${backupPath}`);
    }
  }

  async improveCode(): Promise<void> {
    try {
      const currentCode = await fs.readFile(
        path.resolve(process.cwd(), 'src/lib/infico-ai/builders/ProjectBuilder.ts'),
        'utf-8'
      );

      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `
            Analyze and improve this TypeScript code:
            ${currentCode}
            
            Focus on:
            1. Error handling
            2. Type safety
            3. Code organization
            4. Performance
            
            Provide only the improved code without any explanation.
          `
        }]
      });

      const improvedCode = response.content[0].text;
      
      // Создаем бэкап перед улучшением
      await this.createBackup();

      // Применяем улучшения
      await fs.writeFile(
        path.resolve(process.cwd(), 'src/lib/infico-ai/builders/ProjectBuilder.ts'),
        improvedCode
      );

      console.log('✨ Код успешно улучшен');
    } catch (error) {
      console.error('❌ Ошибка при улучшении кода:', error);
    }
  }
}

// Экспортируем класс
export default SelfHealingBuilder;
