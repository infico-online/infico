import * as fs from 'fs-extra';
import * as path from 'path';
import RouteAnalyzer from './RouteAnalyzer';
import UIAnalyzer from './UIAnalyzer';
import UIAnalyzer from './UIAnalyzer';
import type { Anthropic } from '@anthropic-ai/sdk';

interface ProjectAnalysis {
  structure: {
    components: string[];
    pages: string[];
    apis: string[];
    hooks: string[];
    utils: string[];
  };
  dependencies: {
    framework: string;
    ui: string[];
    state: string[];
    api: string[];
  };
  features: {
    name: string;
    description: string;
    files: string[];
  }[];
}

class ProjectScanner {
  private readonly projectRoot: string;
  private readonly anthropic: Anthropic;

  constructor(projectRoot: string, anthropic: Anthropic) {
    this.projectRoot = projectRoot;
    this.anthropic = anthropic;
  }

  async analyzeProject() {
    console.log('📊 Начинаем полный анализ проекта...');

    const structure = await this.scanProjectStructure();
    console.log('📁 Структура проекта прочитана');

    const packageJson = await this.analyzePackageJson();
    console.log('📦 Зависимости проанализированы');

    const shadcnComponents = await this.analyzeShadcnComponents();
    console.log('🎨 Компоненты shadcn проанализированы');

    const routeAnalyzer = new RouteAnalyzer(this.projectRoot);
    const routeAnalysis = await routeAnalyzer.analyzeRoutes();
    const uiAnalyzer = new UIAnalyzer(this.projectRoot, this.projectRoot);
    await uiAnalyzer.analyzeUI();
    console.log('🎨 UI проанализирован');
    const uiAnalyzer = new UIAnalyzer(this.projectRoot, this.projectRoot);
    await uiAnalyzer.analyzeUI();
    console.log('🎨 UI проанализирован');
    console.log('🛣️ Маршруты проанализированы');
    const globalStyles = await this.analyzeGlobalStyles();
    console.log('🎯 Глобальные стили проанализированы');

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `Проанализируй структуру Next.js проекта и опиши его функционал:

Структура: ${JSON.stringify(structure, null, 2)}
Package.json: ${JSON.stringify(packageJson, null, 2)}
ShadcnUI компоненты: ${JSON.stringify(shadcnComponents, null, 2)}
Глобальные стили: ${JSON.stringify(globalStyles, null, 2)}
Маршруты: ${JSON.stringify(routeAnalysis, null, 2)}

Опиши:
1. Основные функции проекта
2. Архитектуру приложения
3. Используемые технологии
4. Интеграции (Telegram, базы данных и т.д.)
5. Особенности реализации
6. Рекомендации по оптимизации

Формат ответа: Markdown
`
        }]
      });

      const analysis = response.content[0].text;
      
      await fs.writeFile(
        path.join(this.projectRoot, 'PROJECT_ANALYSIS.md'),
        analysis
      );

      console.log('✅ Анализ проекта завершен и сохранен в PROJECT_ANALYSIS.md');
      
      return analysis;

    } catch (error) {
      console.error('❌ Ошибка при анализе проекта:', error);
      return null;
    }
  }

  private async scanProjectStructure() {
    const structure = {
      components: await this.scanDir('src/components'),
      pages: await this.scanDir('src/app'),
      apis: await this.scanDir('src/app/api'),
      hooks: await this.scanDir('src/hooks'),
      utils: await this.scanDir('src/lib')
    };

    return structure;
  }

  private async scanDir(dir: string): Promise<string[]> {
    const fullPath = path.join(this.projectRoot, dir);
    if (!await fs.pathExists(fullPath)) return [];

    const allFiles = await fs.readdir(fullPath, { recursive: true, withFileTypes: true });
    
    return allFiles
      .filter(file => file.isFile())
      .map(file => file.name)
      .filter(fileName => 
        fileName.endsWith('.ts') || 
        fileName.endsWith('.tsx') || 
        fileName.endsWith('.js') || 
        fileName.endsWith('.jsx')
      );
  }

  private async analyzePackageJson() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    return await fs.readJson(packageJsonPath);
  }

  private async analyzeShadcnComponents() {
    const componentsDir = path.join(this.projectRoot, 'src/components/ui');
    if (!await fs.pathExists(componentsDir)) return [];

    const files = await fs.readdir(componentsDir);
    return files.filter(file => file.endsWith('.tsx'));
  }

  private async analyzeGlobalStyles() {
    const globalCssPath = path.join(this.projectRoot, 'src/app/globals.css');
    if (!await fs.pathExists(globalCssPath)) return '';

    return await fs.readFile(globalCssPath, 'utf-8');
  }
}

export default ProjectScanner;
