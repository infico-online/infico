import fs from 'fs-extra';
import path from 'path';
import { parse } from 'svg-parser';

class ProjectGenerator {
  private svgDirectory: string;
  private outputDirectory: string;
  private backupDirectory: string;

  constructor() {
    this.svgDirectory = './public/svg-designs';
    this.outputDirectory = './src';
    this.backupDirectory = `./backups/project-backup-${Date.now()}`;
  }

  // Создание резервной копии
  async createBackup() {
    await fs.ensureDir(this.backupDirectory);
    await fs.copy(this.outputDirectory, `${this.backupDirectory}/src`);
    console.log(`📦 Создан бэкап в ${this.backupDirectory}`);
  }

  // Анализ SVG и определение логики страниц
  async analyzeDesigns() {
    const designs = await fs.readdir(this.svgDirectory);
    
    const pageDesigns = designs.filter(
      file => file.endsWith('.svg') && file.includes('-page')
    );

    const pages = pageDesigns.map(design => ({
      name: this.convertToPageName(design),
      file: design,
      components: this.extractComponents(design)
    }));

    return pages;
  }

  // Преобразование имени файла в имя страницы
  private convertToPageName(filename: string): string {
    return filename
      .replace('-page.svg', '')
      .replace(/-/g, '_')
      .toLowerCase();
  }

  // Извлечение компонентов из SVG
  private extractComponents(svgFile: string): string[] {
    const svgPath = path.join(this.svgDirectory, svgFile);
    const svgContent = fs.readFileSync(svgPath, 'utf-8');
    const parsed = parse(svgContent);

    // Логика определения компонентов
    const components: string[] = [];
    // TODO: Реализовать парсинг SVG
    
    return components;
  }

  // Генерация страниц Next.js
  async generatePages(pages) {
    for (const page of pages) {
      const pageContent = this.createPageTemplate(page);
      const pagePath = path.join(
        this.outputDirectory, 
        'app', 
        page.name, 
        'page.tsx'
      );

      await fs.ensureDir(path.dirname(pagePath));
      await fs.writeFile(pagePath, pageContent);
    }
  }

  // Шаблон страницы
  private createPageTemplate(page) {
    return `
'use client';
import React from 'react';

export default function ${this.toPascalCase(page.name)}Page() {
  return (
    <div className="container mx-auto">
      <h1>${this.toTitleCase(page.name)}</h1>
      {/* Сгенерировано автоматически из ${page.file} */}
      {page.components.map(component => (
        <${this.toPascalCase(component)} key={component} />
      ))}
    </div>
  );
}
    `;
  }

  // Генерация компонентов
  async generateComponents(pages) {
    for (const page of pages) {
      for (const componentName of page.components) {
        const componentContent = this.createComponentTemplate(componentName);
        const componentPath = path.join(
          this.outputDirectory, 
          'components', 
          `${this.toPascalCase(componentName)}.tsx`
        );

        await fs.ensureDir(path.dirname(componentPath));
        await fs.writeFile(componentPath, componentContent);
      }
    }
  }

  // Шаблон компонента
  private createComponentTemplate(componentName: string) {
    return `
import React from 'react';

interface ${this.toPascalCase(componentName)}Props {}

export const ${this.toPascalCase(componentName)}: React.FC<${this.toPascalCase(componentName)}Props> = () => {
  return (
    <div>
      {/* Сгенерировано автоматически */}
      ${this.toTitleCase(componentName)}
    </div>
  );
}
    `;
  }

  // Утилиты для преобразования имен
  private toPascalCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private toTitleCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Основной метод генерации
  async generate() {
    // Создаем бэкап
    await this.createBackup();

    const pages = await this.analyzeDesigns();
    
    await this.generatePages(pages);
    await this.generateComponents(pages);

    console.log('🚀 Проект сгенерирован успешно!');
  }
}

export default new ProjectGenerator();
