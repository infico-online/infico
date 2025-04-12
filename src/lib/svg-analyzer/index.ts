// src/lib/svg-analyzer/index.ts
import * as fs from 'fs-extra';
import * as path from 'path';
import * as xmldom from 'xmldom';

export interface SVGAnalysisResult {
  filename: string;
  metadata: {
    name: string;
    type: string;
    complexity: string;
    language: string;
  };
  components: {
    type: string;
    interactions: string[];
    styles: {
      colors: string[];
      typography: {
        fonts: string[];
        sizes: string[];
      };
    };
  }[];
  layout: {
    width: number;
    height: number;
    sections: string[];
  };
  userFlows: string[];
  colorPalette: string[];
}

export class SVGAnalyzer {
  private parser = new xmldom.DOMParser();

  async analyzeDirectory(directoryPath: string): Promise<SVGAnalysisResult[]> {
    const svgFiles = await this.getSVGFiles(directoryPath);
    const results: SVGAnalysisResult[] = [];

    for (const file of svgFiles) {
      const fullPath = path.join(directoryPath, file);
      const svgContent = await fs.readFile(fullPath, 'utf-8');
      const result = this.analyzeSVG(svgContent, path.basename(file, '.svg'));
      results.push(result);
    }

    return results;
  }

  private analyzeSVG(svgContent: string, filename: string): SVGAnalysisResult {
    const doc = this.parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.documentElement;

    const metadata = this.extractMetadata(svgContent);
    const components = this.extractComponents(doc);
    const layout = this.extractLayout(svgElement);
    const userFlows = this.extractUserFlows(doc);
    const colorPalette = this.extractColorPalette(doc);

    return {
      filename,
      metadata,
      components,
      layout,
      userFlows,
      colorPalette
    };
  }

  private extractMetadata(svgContent: string): SVGAnalysisResult['metadata'] {
    const metadataMatch = svgContent.match(/<!--\s*@metadata\s*([\s\S]*?)\s*-->/);
    const defaultMetadata = {
      name: filename,
      type: 'unknown',
      complexity: 'low',
      language: 'English'
    };

    if (!metadataMatch) return defaultMetadata;

    const metadata: Partial<SVGAnalysisResult['metadata']> = {};
    const lines = metadataMatch[1].trim().split('\n');

    lines.forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        switch (key.toLowerCase()) {
          case 'name': metadata.name = value; break;
          case 'type': metadata.type = value; break;
          case 'complexity': metadata.complexity = value; break;
          case 'language': metadata.language = value; break;
        }
      }
    });

    return { ...defaultMetadata, ...metadata };
  }

  private extractComponents(doc: Document): SVGAnalysisResult['components'] {
    const components: SVGAnalysisResult['components'] = [];
    const elements = doc.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const componentType = element.getAttribute('data-component');
      
      if (componentType) {
        components.push({
          type: componentType,
          interactions: this.extractInteractions(element),
          styles: {
            colors: this.extractColors(element),
            typography: this.extractTypography(element)
          }
        });
      }
    }

    return components;
  }

  private extractInteractions(element: Element): string[] {
    const interactions: string[] = [];
    const interactionAttributes = [
      'onclick', 'onmouseover', 'onmouseout', 
      'data-interaction', 'data-action'
    ];

    interactionAttributes.forEach(attr => {
      const interaction = element.getAttribute(attr);
      if (interaction) interactions.push(interaction);
    });

    return interactions;
  }

  private extractColors(element: Element): string[] {
    const colors = new Set<string>();
    
    // Извлекаем цвета из атрибутов fill и stroke
    const fill = element.getAttribute('fill');
    const stroke = element.getAttribute('stroke');
    
    if (fill && fill !== 'none') colors.add(fill);
    if (stroke && stroke !== 'none') colors.add(stroke);

    // Извлекаем цвета из линейных градиентов
    const gradients = element.getElementsByTagName('linearGradient');
    for (let i = 0; i < gradients.length; i++) {
      const stops = gradients[i].getElementsByTagName('stop');
      for (let j = 0; j < stops.length; j++) {
        const stopColor = stops[j].getAttribute('stop-color');
        if (stopColor) colors.add(stopColor);
      }
    }

    return Array.from(colors);
  }

  private extractColorPalette(doc: Document): string[] {
    const colors = new Set<string>();
    const elements = doc.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
      const fill = elements[i].getAttribute('fill');
      const stroke = elements[i].getAttribute('stroke');
      
      if (fill && fill !== 'none') colors.add(fill);
      if (stroke && stroke !== 'none') colors.add(stroke);
    }

    const gradients = doc.getElementsByTagName('linearGradient');
    for (let i = 0; i < gradients.length; i++) {
      const stops = gradients[i].getElementsByTagName('stop');
      for (let j = 0; j < stops.length; j++) {
        const stopColor = stops[j].getAttribute('stop-color');
        if (stopColor) colors.add(stopColor);
      }
    }

    return Array.from(colors);
  }

  private extractTypography(element: Element): SVGAnalysisResult['components'][0]['styles']['typography'] {
    const fontFamily = element.getAttribute('font-family');
    const fontSize = element.getAttribute('font-size');

    return {
      fonts: fontFamily ? [fontFamily] : [],
      sizes: fontSize ? [fontSize] : []
    };
  }

  private extractLayout(svgElement: Element): SVGAnalysisResult['layout'] {
    const width = parseInt(svgElement.getAttribute('width') || svgElement.getAttribute('viewBox')?.split(' ')[2] || '0');
    const height = parseInt(svgElement.getAttribute('height') || svgElement.getAttribute('viewBox')?.split(' ')[3] || '0');

    return {
      width,
      height,
      sections: this.extractSections(svgElement)
    };
  }

  private extractSections(svgElement: Element): string[] {
    const sections: string[] = [];
    const sectionElements = svgElement.getElementsByTagName('*');

    for (let i = 0; i < sectionElements.length; i++) {
      const section = sectionElements[i].getAttribute('data-section');
      if (section) sections.push(section);
    }

    return [...new Set(sections)];
  }

  private extractUserFlows(doc: Document): string[] {
    const flows: string[] = [];
    const flowElements = doc.getElementsByTagName('*');

    for (let i = 0; i < flowElements.length; i++) {
      const flow = flowElements[i].getAttribute('data-flow');
      if (flow) flows.push(flow);
    }

    return [...new Set(flows)];
  }

  private async getSVGFiles(directoryPath: string): Promise<string[]> {
    try {
      const files = await fs.readdir(directoryPath);
      return files.filter(file => path.extname(file) === '.svg');
    } catch (error) {
      console.error(`Ошибка чтения директории ${directoryPath}:`, error);
      return [];
    }
  }

  async generateMarkdown(results: SVGAnalysisResult[]): Promise<string> {
    let markdown = `# 🎨 Дизайн-система INFICO\n\n`;

    markdown += `## 📊 Общая статистика\n\n`;
    markdown += `- **Всего SVG-файлов**: ${results.length}\n`;
    
    const complexityCounts = {
      low: results.filter(r => r.metadata.complexity === 'low').length,
      medium: results.filter(r => r.metadata.complexity === 'medium').length,
      high: results.filter(r => r.metadata.complexity === 'high').length
    };
    
    markdown += `- **Сложность дизайнов**:\n`;
    markdown += `  - Простые: ${complexityCounts.low}\n`;
    markdown += `  - Средние: ${complexityCounts.medium}\n`;
    markdown += `  - Сложные: ${complexityCounts.high}\n\n`;

    // Глобальная цветовая палитра
    const globalPalette = [...new Set(results.flatMap(r => r.colorPalette))];
    markdown += `## 🌈 Глобальная цветовая палитра\n`;
    markdown += globalPalette.map(color => `- \`${color}\``).join('\n') + '\n\n';

    for (const result of results) {
      markdown += `## 📄 ${result.filename}\n\n`;
      
      markdown += `### 📋 Метаданные\n`;
      markdown += `- **Имя**: ${result.metadata.name}\n`;
      markdown += `- **Тип**: ${result.metadata.type}\n`;
      markdown += `- **Сложность**: ${result.metadata.complexity}\n`;
      markdown += `- **Язык**: ${result.metadata.language}\n\n`;

      markdown += `### 🧩 Компоненты\n`;
      if (result.components.length > 0) {
        result.components.forEach((component, index) => {
          markdown += `#### Компонент ${index + 1}\n`;
          markdown += `- **Тип**: ${component.type}\n`;
          markdown += `- **Взаимодействия**: ${component.interactions.join(', ') || 'Нет'}\n`;
          markdown += `- **Цвета**: ${component.styles.colors.join(', ') || 'Нет'}\n`;
          
          markdown += `- **Типографика**:\n`;
          markdown += `  - Шрифты: ${component.styles.typography.fonts.join(', ') || 'Не определены'}\n`;
          markdown += `  - Размеры: ${component.styles.typography.sizes.join(', ') || 'Не определены'}\n`;
        });
      } else {
        markdown += `- Компоненты не найдены\n`;
      }

      markdown += `\n### 📐 Макет\n`;
      markdown += `- **Ширина**: ${result.layout.width} пикс.\n`;
      markdown += `- **Высота**: ${result.layout.height} пикс.\n`;
      markdown += `- **Секции**: ${result.layout.sections.join(', ') || 'Нет'}\n\n`;

      markdown += `### 🔀 Пользовательские потоки\n`;
      markdown += `- ${result.userFlows.join('\n- ') || 'Не определены'}\n\n`;
    }

    return markdown;
  }
}

async function main() {
  const analyzer = new SVGAnalyzer();
  const directoryPath = path.join(process.cwd(), 'public/svg-designs');
  
  try {
    const results = await analyzer.analyzeDirectory(directoryPath);
    const markdown = await analyzer.generateMarkdown(results);
    
    await fs.writeFile(path.join(process.cwd(), 'DESIGN_SYSTEM.md'), markdown);
    console.log('✅ Анализ завершен. Результаты сохранены в DESIGN_SYSTEM.md');
  } catch (error) {
    console.error('❌ Ошибка при анализе:', error);
  }
}

main();