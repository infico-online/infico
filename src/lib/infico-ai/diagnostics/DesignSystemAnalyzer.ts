import * as fs from 'fs-extra';
import * as path from 'path';
import { SVGParser } from './SVGParser';

interface CardAnalysis {
  name: string;
  components: string[];
  states: string[];
  styles: {
    padding: string;
    background: string;
    borderRadius: string;
    shadow: string;
  };
}

interface ScreenAnalysis {
  name: string;
  sections: {
    name: string;
    components: string[];
    layout: string;
  }[];
}

interface FlowAnalysis {
  name: string;
  steps: {
    screen: string;
    action: string;
    result: string;
  }[];
}

interface StyleAnalysis {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    heading: {
      font: string;
      sizes: string[];
    };
    body: {
      font: string;
      sizes: string[];
    };
  };
  spacing: {
    layout: string[];
    components: string[];
  };
}

interface SVGAnalysis {
  name: string;
  colors: string[];
  components: string[];
  layout: string;
  metadata: string;
}

class DesignSystemAnalyzer {
  private parser: SVGParser;

  constructor(private readonly svgDir: string) {
    this.parser = new SVGParser();
  }

  async analyzeSVGDesigns(): Promise<string> {
    const svgs = await this.getSVGFiles();
    const analysis = await this.generateAnalysis(svgs);
    return this.generateMarkdown(analysis);
  }

  private async getSVGFiles(): Promise<string[]> {
    const entries = await fs.readdir(this.svgDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.svg'))
      .map(entry => path.join(this.svgDir, entry.name));
  }

  private async generateAnalysis(svgs: string[]): Promise<{
    cards: CardAnalysis[];
    screens: ScreenAnalysis[];
    flows: FlowAnalysis[];
    styles: StyleAnalysis;
  }> {
    return {
      cards: await this.analyzeCards(svgs),
      screens: await this.analyzeScreens(svgs),
      flows: await this.analyzeFlows(svgs),
      styles: await this.analyzeStyles(svgs)
    };
  }

  private async analyzeSVGContent(filePath: string): Promise<SVGAnalysis> {
    const content = await fs.readFile(filePath, 'utf-8');
    
    return {
      name: path.basename(filePath, '.svg')
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase()),
      colors: Array.from(content.matchAll(/#[0-9A-Fa-f]{6}/g))
        .map(match => match[0]),
      components: Array.from(content.matchAll(/<(rect|circle|path|g|text)[^>]*class="([^"]+)"/g))
        .map(match => match[2])
        .filter(className => className.includes('component-')),
      layout: Array.from(content.matchAll(/class="([^"]+layout[^"]+)"/g))
        .map(match => match[1])
        .join(' '),
      metadata: content.match(/<!--\s*@metadata\s*([\s\S]*?)\s*-->/)?.[1]?.trim() || ''
    };
  }

  private async analyzeCards(svgs: string[]): Promise<CardAnalysis[]> {
    const cardFiles = svgs.filter(svg => svg.includes('card') || svg.includes('Card'));
    const cards: CardAnalysis[] = [];

    for (const file of cardFiles) {
      const analysis = await this.analyzeSVGContent(file);
      cards.push({
        name: analysis.name,
        components: analysis.components,
        states: this.extractStatesFromMetadata(analysis.metadata),
        styles: this.extractStylesFromSVG(analysis)
      });
    }

    return cards;
  }

  private async analyzeScreens(svgs: string[]): Promise<ScreenAnalysis[]> {
    const screenFiles = svgs.filter(svg => 
      svg.includes('page') || 
      svg.includes('screen') || 
      svg.includes('Page') || 
      svg.includes('Screen')
    );
    
    const screens: ScreenAnalysis[] = [];

    for (const file of screenFiles) {
      const analysis = await this.analyzeSVGContent(file);
      screens.push({
        name: analysis.name,
        sections: this.extractSectionsFromSVG(analysis)
      });
    }

    return screens;
  }

  private async analyzeFlows(svgs: string[]): Promise<FlowAnalysis[]> {
    const flowFiles = svgs.filter(svg => 
      svg.includes('flow') || 
      svg.includes('Flow') || 
      svg.includes('process') || 
      svg.includes('Process')
    );

    const flows: FlowAnalysis[] = [];

    for (const file of flowFiles) {
      const analysis = await this.analyzeSVGContent(file);
      flows.push({
        name: analysis.name,
        steps: this.extractStepsFromSVG(analysis)
      });
    }

    return flows;
  }

  private extractStatesFromMetadata(metadata: string): string[] {
    const statesMatch = metadata.match(/@states\s+([\s\S]*?)(?=@|$)/);
    return statesMatch ? statesMatch[1].trim().split('\n').map(s => s.trim()) : [];
  }

  private extractStylesFromSVG(analysis: SVGAnalysis): CardAnalysis['styles'] {
    return {
      padding: analysis.components.find(c => c.includes('padding-'))?.replace('padding-', '') || '',
      background: analysis.colors[0] || '',
      borderRadius: analysis.components.find(c => c.includes('radius-'))?.replace('radius-', '') || '',
      shadow: analysis.components.find(c => c.includes('shadow-'))?.replace('shadow-', '') || ''
    };
  }

  private extractSectionsFromSVG(analysis: SVGAnalysis): ScreenAnalysis['sections'] {
    return analysis.components
      .filter(comp => comp.includes('section-'))
      .map(sectionClass => {
        const sectionName = sectionClass.replace('section-', '');
        return {
          name: sectionName,
          components: this.extractComponentsForSection(analysis.components, sectionName),
          layout: this.extractLayoutForSection(analysis.layout, sectionName)
        };
      });
  }

  private extractComponentsForSection(components: string[], sectionName: string): string[] {
    return components
      .filter(comp => comp.includes(`section-${sectionName}-component-`))
      .map(comp => comp.replace(`section-${sectionName}-component-`, ''));
  }

  private extractLayoutForSection(layout: string, sectionName: string): string {
    const sectionLayout = layout.match(new RegExp(`section-${sectionName}-layout-([^\\s]+)`));
    return sectionLayout ? sectionLayout[1] : '';
  }

  private extractStepsFromSVG(analysis: SVGAnalysis): FlowAnalysis['steps'] {
    return analysis.components
      .filter(comp => comp.includes('step-'))
      .map(step => {
        const [_, screen, action, result] = step.match(/step-([^-]+)-([^-]+)-(.+)/) || [];
        return {
          screen: screen || '',
          action: action || '',
          result: result || ''
        };
      });
  }

  private async analyzeStyles(svgs: string[]): Promise<StyleAnalysis> {
    const defaultStyles: StyleAnalysis = {
      colors: {
        primary: '',
        secondary: '',
        accent: '',
        background: '',
        text: ''
      },
      typography: {
        heading: { font: '', sizes: [] },
        body: { font: '', sizes: [] }
      },
      spacing: {
        layout: [],
        components: []
      }
    };

    for (const svg of svgs) {
      const analysis = await this.analyzeSVGContent(svg);
      this.updateStylesFromSVG(defaultStyles, analysis);
    }

    return defaultStyles;
  }

  private updateStylesFromSVG(styles: StyleAnalysis, analysis: SVGAnalysis): void {
    if (analysis.colors.length > 0) {
      styles.colors.primary = analysis.colors[0];
      styles.colors.secondary = analysis.colors[1] || styles.colors.primary;
      styles.colors.accent = analysis.colors[2] || styles.colors.secondary;
      styles.colors.background = analysis.colors.find(c => c.includes('background')) || styles.colors.background;
      styles.colors.text = analysis.colors.find(c => c.includes('text')) || styles.colors.text;
    }

    const typography = this.extractTypographyFromSVG(analysis);
    if (typography.heading.font) styles.typography.heading.font = typography.heading.font;
    if (typography.heading.sizes.length > 0) styles.typography.heading.sizes = typography.heading.sizes;
    if (typography.body.font) styles.typography.body.font = typography.body.font;
    if (typography.body.sizes.length > 0) styles.typography.body.sizes = typography.body.sizes;

    const spacing = this.extractSpacingFromSVG(analysis);
    if (spacing.layout.length > 0) styles.spacing.layout = spacing.layout;
    if (spacing.components.length > 0) styles.spacing.components = spacing.components;
  }

  private extractTypographyFromSVG(analysis: SVGAnalysis): {
    heading: { font: string; sizes: string[] };
    body: { font: string; sizes: string[] };
  } {
    return {
      heading: {
        font: analysis.components.find(c => c.includes('heading-font-'))?.replace('heading-font-', '') || '',
        sizes: analysis.components
          .filter(c => c.includes('heading-size-'))
          .map(c => c.replace('heading-size-', ''))
      },
      body: {
        font: analysis.components.find(c => c.includes('body-font-'))?.replace('body-font-', '') || '',
        sizes: analysis.components
          .filter(c => c.includes('body-size-'))
          .map(c => c.replace('body-size-', ''))
      }
    };
  }

  private extractSpacingFromSVG(analysis: SVGAnalysis): StyleAnalysis['spacing'] {
    return {
      layout: analysis.components
        .filter(c => c.includes('layout-spacing-'))
        .map(c => c.replace('layout-spacing-', '')),
      components: analysis.components
        .filter(c => c.includes('component-spacing-'))
        .map(c => c.replace('component-spacing-', ''))
    };
  }

  private generateMarkdown(analysis: {
    cards: CardAnalysis[];
    screens: ScreenAnalysis[];
    flows: FlowAnalysis[];
    styles: StyleAnalysis;
  }): string {
    return `
# Design System Analysis

${this.generateCardsMarkdown(analysis.cards)}

${this.generateScreensMarkdown(analysis.screens)}

${this.generateFlowsMarkdown(analysis.flows)}

${this.generateStylesMarkdown(analysis.styles)}
    `.trim();
  }

  private generateCardsMarkdown(cards: CardAnalysis[]): string {
    if (cards.length === 0) return '';

    return `
## Cards

${cards.map(card => `
### ${card.name}

- **Components**: ${card.components.join(', ')}
- **States**: ${card.states.join(', ')}
- **Styles**:
  - Padding: ${card.styles.padding}
  - Background: ${card.styles.background}
  - Border Radius: ${card.styles.borderRadius}
  - Shadow: ${card.styles.shadow}
`).join('\n')}
    `.trim();
  }

  private generateScreensMarkdown(screens: ScreenAnalysis[]): string {
    if (screens.length === 0) return '';

    return `
## Screens

${screens.map(screen => `
### ${screen.name}

${screen.sections.map(section => `
#### ${section.name}

- **Components**: ${section.components.join(', ')}
- **Layout**: ${section.layout}
`).join('\n')}
`).join('\n')}
    `.trim();
  }

  private generateFlowsMarkdown(flows: FlowAnalysis[]): string {
    if (flows.length === 0) return '';

    return `
## Flows

${flows.map(flow => `
### ${flow.name}

${flow.steps.map(step => `
- **Screen**: ${step.screen}
  - Action: ${step.action}
  - Result: ${step.result}
`).join('\n')}
`).join('\n')}
    `.trim();
  }

  private generateStylesMarkdown(styles: StyleAnalysis): string {
    return `
## Styles

### Colors
- Primary: ${styles.colors.primary}
- Secondary: ${styles.colors.secondary}
- Accent: ${styles.colors.accent}
- Background: ${styles.colors.background}
- Text: ${styles.colors.text}

### Typography
#### Heading
- Font: ${styles.typography.heading.font}
- Sizes: ${styles.typography.heading.sizes.join(', ')}

#### Body
- Font: ${styles.typography.body.font}
- Sizes: ${styles.typography.body.sizes.join(', ')}

### Spacing
#### Layout
${styles.spacing.layout.map(s => `- ${s}`).join('\n')}

#### Components
${styles.spacing.components.map(s => `- ${s}`).join('\n')}
    `.trim();
  }
}

export default DesignSystemAnalyzer;
