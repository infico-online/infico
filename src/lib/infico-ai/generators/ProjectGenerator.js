import fs from 'fs-extra';
import path from 'path';

export class ProjectGenerator {
  constructor() {
    this.svgDirectory = './public/svg-designs';
    this.outputDirectory = './src';
    this.backupDirectory = `./backups/project-backup-${Date.now()}`;
  }

  async analyzeDesigns() {
    const designs = await fs.readdir(this.svgDirectory);
    
    const pageDesigns = designs.filter(
      file => file.endsWith('.svg') && file.includes('-page')
    );

    const pages = [];
    for (const design of pageDesigns) {
      pages.push({
        name: this.convertToPageName(design),
        file: design,
        description: this.getDefaultDescription(design),
        components: ['Header', 'MainContent', 'Footer']
      });
    }

    return pages;
  }

  getDefaultDescription(filename) {
    const descriptions = {
      'channels-page.svg': 'Страница списка каналов в проекте INFICO',
      'ico-details-page.svg': 'Детальная информация о ICO',
      'create-profile-page.txt': 'Страница создания профиля пользователя',
      'profile-page.svg': 'Личный кабинет пользователя',
      'analytics-page.svg': 'Аналитическая панель с статистикой',
      'verification-page.svg': 'Страница верификации',
      'token-operations.svg': 'Операции с токенами',
      'default': 'Страница проекта INFICO'
    };

    return descriptions[filename] || descriptions['default'];
  }

  convertToPageName(filename) {
    return filename
      .replace('-page.svg', '')
      .replace('.txt', '')
      .replace(/-/g, '_')
      .toLowerCase();
  }

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

  createPageTemplate(page) {
    return `
'use client';
import React from 'react';

export default function ${this.toPascalCase(page.name)}Page() {
  return (
    <div className="container mx-auto">
      <h1>${this.toTitleCase(page.name)}</h1>
      <p>${page.description}</p>
      {/* Автоматически сгенерировано из ${page.file} */}
    </div>
  );
}
    `;
  }

  toPascalCase(str) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  toTitleCase(str) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async generate() {
    console.log('🚀 Начало генерации проекта...');
    
    const pages = await this.analyzeDesigns();
    await this.generatePages(pages);

    console.log(`✅ Сгенерировано страниц: ${pages.length}`);
    return pages;
  }
}

export default new ProjectGenerator();
