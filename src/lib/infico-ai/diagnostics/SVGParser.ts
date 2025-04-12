// src/lib/infico-ai/diagnostics/SVGAnalyzer.ts
import * as path from 'path';
import * as fs from 'fs-extra';
import { DOMParser } from 'xmldom';
import { createHash } from 'crypto';

interface SVGComponentAnalysis {
  name: string;
  type: string;
  complexity: string;
  interactions: string[];
  colors: string[];
  layout: {
    width: number;
    height: number;
    sections: string[];
  };
}

interface SVGFlowAnalysis {
  name: string;
  steps: string[];
  interactions: string[];
}

interface DesignSystemAnalysis {
  components: Record<string, SVGComponentAnalysis>;
  flows: Record<string, SVGFlowAnalysis>;
  palette: string[];
  complexity: {
    total: number;
    average: number;
  };
}

export class SVGAnalyzer {
  private parser = new DOMParser();

  constructor(private readonly svgDir: string) {}

  async analyze(): Promise<DesignSystemAnalysis> {
    const files = await this.getSVGFiles();
    const analysis: DesignSystemAnalysis = {
      components: {},
      flows: {},
      palette: [],
      complexity: { total: 0, average: 0 }
    };

    for (const file of files) {
      try {
        const svgContent = await fs.readFile(file, 'utf-8');
        const doc = this.parser.parseFromString(svgContent, 'image/svg+xml');
        const filename = path.basename(file, '.svg');

        const componentAnalysis = this.analyzeComponent(doc, filename);
        analysis.components[filename] = componentAnalysis;
        
        analysis.palette.push(...componentAnalysis.colors);
        analysis.complexity.total += this.calculateComplexity(componentAnalysis);
      } catch (error) {
        console.error(`Ошибка анализа ${file}:`, error);
      }
    }

    analysis.palette = [...new Set(analysis.palette)];
    analysis.complexity.average = analysis.complexity.total / files.length;

    return analysis;
  }

  private calculateComplexity(component: SVGComponentAnalysis): number {
    const interactionScore = component.interactions.length * 2;
    const colorScore = component.colors.length;
    const layoutScore = component.layout.sections.length;
    return interactionScore + colorScore + layoutScore;
  }

  private analyzeComponent(doc: any, filename: string): SVGComponentAnalysis {
    const svgElement = doc.documentElement;
    const width = parseInt(svgElement.getAttribute('width') || '0');
    const height = parseInt(svgElement.getAttribute('height') || '0');

    const colors = this.extractColors(doc);
    const interactions = this.extractInteractions(doc);
    const sections = this.extractSections(doc);

    return {
      name: filename,
      type: this.determineComponentType(doc),
      complexity: this.determineComplexity(interactions, colors, sections),
      interactions,
      colors,
      layout: {
        width,
        height,
        sections
      }
    };
  }

  private extractColors(doc: any): string[] {
    const colors = new Set<string>();
    const elements = doc.getElementsByTagName('*');
    
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const fill = el.getAttribute('fill');
      const stroke = el.getAttribute('stroke');
      
      if (fill && fill !== 'none') colors.add(fill);
      if (stroke && stroke !== 'none') colors.add(stroke);
    }

    const styleElements = doc.getElementsByTagName('style');
    for (let i = 0; i < styleElements.length; i++) {
      const styleContent = styleElements[i].textContent || '';
      const colorMatches = styleContent.match(/#[0-9A-Fa-f]{3,6}/g) || [];
      colorMatches.forEach(color => colors.add(color));
    }

    return Array.from(colors);
  }

  private extractInteractions(doc: any): string[] {
    const interactions: string[] = [];
    const interactiveAttributes = [
      'onclick', 'onmouseover', 'onmouseout', 
      'data-interaction', 'data-action'
    ];

    const elements = doc.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      interactiveAttributes.forEach(attr => {
        const value = el.getAttribute(attr);
        if (value) interactions.push(value);
      });
    }

    return [...new Set(interactions)];
  }

  private extractSections(doc: any): string[] {
    const sections: string[] = [];
    const elements = doc.getElementsByTagName('*');
    
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const dataSection = el.getAttribute('data-section');
      if (dataSection) sections.push(dataSection);
    }

    return [...new Set(sections)];
  }

  private determineComponentType(doc: any): string {
    const metadata = this.extractMetadata(doc);
    return metadata.type || 'unknown';
  }

  private determineComplexity(
    interactions: string[], 
    colors: string[], 
    sections: string[]
  ): string {
    const score = interactions.length + colors.length + sections.length;
    if (score < 3) return 'low';
    if (score < 7) return 'medium';
    return 'high';
  }

  private extractMetadata(doc: any): Record<string, string> {
    // Логика извлечения метаданных из SVG комментариев
    return {};
  }

  private async getSVGFiles(): Promise<string[]> {
    const entries = await fs.readdir(this.svgDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.svg'))
      .map(entry => path.join(this.svgDir, entry.name));
  }
}