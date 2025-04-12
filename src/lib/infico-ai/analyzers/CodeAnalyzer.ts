import { promises as fs } from 'fs';
import path from 'path';
import processor from '../core/processor';

export class CodeAnalyzer {
  async analyzeFile(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const analysis = await processor.analyzeSyntax(content);
      
      console.log(`Анализ файла ${filePath}:`);
      console.log(analysis);
      
      // Сохраняем отчет
      const reportPath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath, path.extname(filePath))}-analysis.md`
      );
      await fs.writeFile(reportPath, analysis);
      
    } catch (error) {
      console.error(`Ошибка при анализе файла ${filePath}:`, error);
    }
  }

  async analyzeDirectory(dirPath: string): Promise<void> {
    try {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          await this.analyzeFile(path.join(dirPath, file));
        }
      }
    } catch (error) {
      console.error(`Ошибка при анализе директории ${dirPath}:`, error);
    }
  }
}
