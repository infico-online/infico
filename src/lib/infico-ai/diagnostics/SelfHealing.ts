import type { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs-extra';
import * as path from 'path';
import ProjectAnalyzer from './ProjectAnalyzer';

class SelfHealing {
  private readonly projectRoot: string;
  private readonly anthropic: Anthropic;
  private readonly analyzer: ProjectAnalyzer;

  constructor(projectRoot: string, anthropic: Anthropic) {
    this.projectRoot = projectRoot;
    this.anthropic = anthropic;
    this.analyzer = new ProjectAnalyzer(projectRoot, anthropic);
  }

  async heal(): Promise<void> {
    console.log('🚀 Начинаем процесс самодиагностики и лечения');

    try {
      // 1. Анализ и исправление зависимостей
      await this.analyzer.analyzeDependencies();

      // 2. Анализ и исправление PostCSS
      await this.analyzer.analyzePostCSS();

      // 3. Анализ и оптимизация кода
      await this.analyzer.analyzeAndOptimizeCode();

      // 4. Поиск и исправление ошибок сборки
      await this.analyzer.findAndFixBuildErrors();

      console.log('✅ Процесс самодиагностики завершен успешно');
    } catch (error) {
      console.error('❌ Ошибка при самодиагностике:', error);
    }
  }
}

export default SelfHealing;
