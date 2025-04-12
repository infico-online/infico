import * as fs from 'fs-extra';
import * as path from 'path';

interface UIComponent {
  name: string;
  type: 'card' | 'tab' | 'filter' | 'button' | 'input' | 'modal' | 'other';
  styles: {
    layout: string[];
    colors: string[];
    typography: string[];
    spacing: string[];
    animations: string[];
  };
  props: string[];
  children: UIComponent[];
  interactions: string[];
}

interface Screen {
  name: string;
  path: string;
  layout: {
    header?: UIComponent;
    content: UIComponent[];
    footer?: UIComponent;
    navigation?: UIComponent;
  };
  features: string[];
  userFlows: UserFlow[];
}

interface UserFlow {
  name: string;
  startPoint: string;
  endPoint: string;
  steps: {
    screen: string;
    action: string;
    result: string;
  }[];
  requirements?: string[];
  validations?: string[];
}

interface ThemeAnalysis {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    text: string[];
    background: string[];
  };
  typography: {
    fonts: string[];
    sizes: string[];
    weights: string[];
  };
  spacing: string[];
  breakpoints: string[];
  animations: string[];
}

class UIAnalyzer {
  constructor(
    private projectRoot: string,
    private outputPath: string
  ) {}

  async analyzeUI(): Promise<void> {
    const components = await this.analyzeComponents();
    const screens = await this.analyzeScreens();
    const userFlows = await this.analyzeUserFlows();
    const theme = await this.analyzeTheme();

    const analysis = this.generateMarkdown(components, screens, userFlows, theme);
    
    await fs.writeFile(
      path.join(this.outputPath, 'UI_ANALYSIS.md'),
      analysis
    );
  }

  private async analyzeComponents(): Promise<UIComponent[]> {
    const componentsDir = path.join(this.projectRoot, 'src/components');
    const components: UIComponent[] = [];

    if (await fs.pathExists(componentsDir)) {
      const entries = await fs.readdir(componentsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.tsx')) {
          const filePath = path.join(componentsDir, entry.name);
          const content = await fs.readFile(filePath, 'utf-8');
          components.push(this.parseComponent(content));
        }
      }
    }

    return components;
  }

  private async analyzeScreens(): Promise<Screen[]> {
    const pagesDir = path.join(this.projectRoot, 'src/app');
    const screens: Screen[] = [];

    if (await fs.pathExists(pagesDir)) {
      const entries = await fs.readdir(pagesDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name === 'page.tsx') {
          const filePath = path.join(pagesDir, entry.name);
          const content = await fs.readFile(filePath, 'utf-8');
          screens.push(this.parseScreen(content));
        }
      }
    }

    return screens;
  }

  private async analyzeUserFlows(): Promise<UserFlow[]> {
    const userFlows: UserFlow[] = [];

    // Анализируем структуру приложения для определения пользовательских потоков
    const routesDir = path.join(this.projectRoot, 'src/app');
    if (await fs.pathExists(routesDir)) {
      const entries = await fs.readdir(routesDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          userFlows.push(...await this.analyzeRouteFlow(entry.name, routesDir));
        }
      }
    }

    return userFlows;
  }

  private async analyzeRouteFlow(routeName: string, routesDir: string): Promise<UserFlow[]> {
    const flows: UserFlow[] = [];
    const routePath = path.join(routesDir, routeName);
    const pageFile = path.join(routePath, 'page.tsx');

    if (await fs.pathExists(pageFile)) {
      const content = await fs.readFile(pageFile, 'utf-8');
      
      flows.push({
        name: `${routeName} Flow`,
        startPoint: routeName,
        endPoint: this.extractEndPoint(content),
        steps: this.extractFlowSteps(content),
        requirements: this.extractRequirements(content),
        validations: this.extractValidations(content)
      });
    }

    return flows;
  }

  private async analyzeTheme(): Promise<ThemeAnalysis> {
    const theme: ThemeAnalysis = {
      colors: {
        primary: [],
        secondary: [],
        accent: [],
        text: [],
        background: []
      },
      typography: {
        fonts: [],
        sizes: [],
        weights: []
      },
      spacing: [],
      breakpoints: [],
      animations: []
    };

    // Анализируем файлы стилей
    const globalCss = path.join(this.projectRoot, 'src/app/globals.css');
    if (await fs.pathExists(globalCss)) {
      const content = await fs.readFile(globalCss, 'utf-8');
      this.parseThemeStyles(content, theme);
    }

    return theme;
  }

  private parseComponent(content: string): UIComponent {
    return {
      name: this.extractComponentName(content),
      type: this.determineComponentType(content),
      styles: this.parseStyles(content),
      props: this.parseProps(content),
      children: this.parseChildren(content),
      interactions: this.parseInteractions(content)
    };
  }

  private parseScreen(content: string): Screen {
    return {
      name: this.extractScreenName(content),
      path: this.extractScreenPath(content),
      layout: this.parseLayout(content),
      features: this.extractFeatures(content),
      userFlows: this.extractScreenFlows(content)
    };
  }

  private extractComponentName(content: string): string {
    const match = content.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
    return match?.[1] || 'UnnamedComponent';
  }

  private determineComponentType(content: string): UIComponent['type'] {
    if (content.includes('Card')) return 'card';
    if (content.includes('Tab')) return 'tab';
    if (content.includes('Filter')) return 'filter';
    if (content.includes('Button')) return 'button';
    if (content.includes('Input')) return 'input';
    if (content.includes('Modal')) return 'modal';
    return 'other';
  }

  private parseStyles(content: string): UIComponent['styles'] {
    return {
      layout: this.extractClassNames(content, 'flex|grid|container'),
      colors: this.extractClassNames(content, 'bg-|text-|border-'),
      typography: this.extractClassNames(content, 'font-|text-'),
      spacing: this.extractClassNames(content, 'p-|m-|gap-'),
      animations: this.extractClassNames(content, 'animate-|transition-')
    };
  }

  private parseProps(content: string): string[] {
    const props: string[] = [];
    const propsMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/);
    if (propsMatch) {
      props.push(...propsMatch[1].split('\n').map(line => line.trim()).filter(Boolean));
    }
    return props;
  }

  private parseChildren(content: string): UIComponent[] {
    const children: UIComponent[] = [];
    const componentMatches = content.matchAll(/<([A-Z]\w+)[^>]*>/g);
    for (const match of componentMatches) {
      children.push({
        name: match[1],
        type: 'other',
        styles: { layout: [], colors: [], typography: [], spacing: [], animations: [] },
        props: [],
        children: [],
        interactions: []
      });
    }
    return children;
  }

  private parseInteractions(content: string): string[] {
    const interactions: string[] = [];
    const handlerMatches = content.matchAll(/on\w+={([^}]+)}/g);
    for (const match of handlerMatches) {
      interactions.push(match[1]);
    }
    return interactions;
  }

  private extractClassNames(content: string, pattern: string): string[] {
    const classNames: string[] = [];
    const regex = new RegExp(`className="[^"]*?(${pattern}[^"\\s]+)`, 'g');
    const matches = content.matchAll(regex);
    for (const match of matches) {
      classNames.push(match[1]);
    }
    return [...new Set(classNames)];
  }

  private extractScreenName(content: string): string {
    const match = content.match(/export\s+default\s+function\s+(\w+)/);
    return match?.[1] || 'UnnamedScreen';
  }

  private extractScreenPath(content: string): string {
    // Извлекаем путь из комментариев или метаданных
    const match = content.match(/@path\s+([^\n]+)/);
    return match?.[1] || '/';
  }

  private parseLayout(content: string): Screen['layout'] {
    return {
      header: this.findLayoutComponent(content, 'Header'),
      content: this.findContentComponents(content),
      footer: this.findLayoutComponent(content, 'Footer'),
      navigation: this.findLayoutComponent(content, 'Navigation')
    };
  }

  private findLayoutComponent(content: string, type: string): UIComponent | undefined {
    const match = content.match(new RegExp(`<${type}[^>]*>([\\s\\S]*?)</${type}>`));
    if (match) {
      return {
        name: type,
        type: 'other',
        styles: this.parseStyles(match[0]),
        props: this.parseProps(match[0]),
        children: this.parseChildren(match[0]),
        interactions: this.parseInteractions(match[0])
      };
    }
    return undefined;
  }

  private findContentComponents(content: string): UIComponent[] {
    const components: UIComponent[] = [];
    const componentMatches = content.matchAll(/<([A-Z]\w+)[^>]*>/g);
    for (const match of componentMatches) {
      components.push({
        name: match[1],
        type: this.determineComponentType(match[0]),
        styles: this.parseStyles(match[0]),
        props: this.parseProps(match[0]),
        children: [],
        interactions: this.parseInteractions(match[0])
      });
    }
    return components;
  }

  private extractFeatures(content: string): string[] {
    const features: string[] = [];
    const importMatches = content.matchAll(/import\s+{\s*([^}]+)\s*}/g);
    for (const match of importMatches) {
      features.push(...match[1].split(',').map(f => f.trim()));
    }
    return features;
  }

  private extractScreenFlows(content: string): UserFlow[] {
    const flows: UserFlow[] = [];
    const handlerMatches = content.matchAll(/\bonClick={([^}]+)}/g);
    for (const match of handlerMatches) {
      flows.push({
        name: 'Click Flow',
        startPoint: 'current',
        endPoint: 'next',
        steps: [
          {
            screen: 'current',
            action: match[1],
            result: 'navigate'
          }
        ]
      });
    }
    return flows;
  }

  private extractEndPoint(content: string): string {
    const routeMatch = content.match(/router\.push\(['"]([^'"]+)['"]\)/);
    return routeMatch?.[1] || 'unknown';
  }

  private extractFlowSteps(content: string): UserFlow['steps'] {
    const steps: UserFlow['steps'] = [];
    const handlerMatches = content.matchAll(/\bonClick={([^}]+)}/g);
    for (const match of handlerMatches) {
      steps.push({
        screen: 'current',
        action: match[1],
        result: 'next'
      });
    }
    return steps;
  }

  private extractRequirements(content: string): string[] {
    const requirements: string[] = [];
    const importMatches = content.matchAll(/import\s+{\s*([^}]+)\s*}/g);
    for (const match of importMatches) {
      requirements.push(...match[1].split(',').map(r => r.trim()));
    }
    return requirements;
  }

  private extractValidations(content: string): string[] {
    const validations: string[] = [];
    const validationMatches = content.matchAll(/validate\w+|isValid\w+/g);
    for (const match of validationMatches) {
      validations.push(match[0]);
    }
    return validations;
  }

  private parseThemeStyles(content: string, theme: ThemeAnalysis): void {
    // Цвета
    const colorMatches = content.matchAll(/--(\w+):\s*([^;]+);/g);
    for (const match of colorMatches) {
      const [_, name, value] = match;
      if (name.includes('primary')) theme.colors.primary.push(value);
      else if (name.includes('secondary')) theme.colors.secondary.push(value);
      else if (name.includes('accent')) theme.colors.accent.push(value);
      else if (name.includes('text')) theme.colors.text.push(value);
      else if (name.includes('background')) theme.colors.background.push(value);
    }

    // Типография
    const fontMatches = content.matchAll(/font-family:\s*([^;]+);/g);
    for (const match of fontMatches) {
      theme.typography.fonts.push(match[1]);
    }

    // Размеры
    const sizeMatches = content.matchAll(/font-size:\s*([^;]+);/g);
    for (const match of sizeMatches) {
      theme.typography.sizes.push(match[1]);
    }

    // Отступы
    const spacingMatches = content.matchAll(/\b(p|m)[trblxy]?-[0-9]+/g);
    for (const match of spacingMatches) {
      theme.spacing.push(match[0]);
    }

    // Брейкпоинты
    const breakpointMatches = content.matchAll(/@media[^{]+/g);
    for (const match of breakpointMatches) {
      theme.breakpoints.push(match[0]);
    }

    // Анимации
    const animationMatches = content.matchAll(/animation:[^;]+/g);
    for (const match of animationMatches) {
      theme.animations.push(match[0]);
    }
  }

   private generateMarkdown(
     components: UIComponent[],
     screens: Screen[],
     userFlows: UserFlow[],
     theme: ThemeAnalysis
   ): string {
     return `
  # Подробный анализ пользовательского интерфейса INFICO
  
  ## 1. Компоненты интерфейса
  
  ${this.generateComponentsSection(components)}
  
  ## 2. Экраны приложения
  
  ${this.generateScreensSection(screens)}
  
  ## 3. Пользовательские потоки
  
  ${this.generateUserFlowsSection(userFlows)}
  
  ## 4. Тема и стилизация
  
  ${this.generateThemeSection(theme)}
     `;
   }
  
   private generateComponentsSection(components: UIComponent[]): string {
     return `
  ### Общие компоненты
  
  ${components.map(component => `
  #### ${component.name} (${component.type})
  
  **Стили:**
  - Layout: ${component.styles.layout.join(', ')}
  - Colors: ${component.styles.colors.join(', ')}
  - Typography: ${component.styles.typography.join(', ')}
  - Spacing: ${component.styles.spacing.join(', ')}
  - Animations: ${component.styles.animations.join(', ')}
  
  **Props:**
  ${component.props.map(prop => `- ${prop}`).join('\n')}
  
  **Взаимодействия:**
  ${component.interactions.map(interaction => `- ${interaction}`).join('\n')}
  
  **Дочерние компоненты:**
  ${component.children.map(child => `- ${child.name}`).join('\n')}
  `).join('\n')}
     `;
   }
  
   private generateScreensSection(screens: Screen[]): string {
     return `
  ### Экраны приложения
  
  ${screens.map(screen => `
  #### ${screen.name} (${screen.path})
  
  **Структура:**
  ${screen.layout.header ? `- Header: ${screen.layout.header.name}` : ''}
  - Content:
  ${screen.layout.content.map(c => `  - ${c.name}`).join('\n')}
  ${screen.layout.footer ? `- Footer: ${screen.layout.footer.name}` : ''}
  ${screen.layout.navigation ? `- Navigation: ${screen.layout.navigation.name}` : ''}
  
  **Функции:**
  ${screen.features.map(feature => `- ${feature}`).join('\n')}
  
  **Потоки:**
  ${screen.userFlows.map(flow => `
  - ${flow.name}:
   - Start: ${flow.startPoint}
   - End: ${flow.endPoint}
   - Steps:
     ${flow.steps.map(step => `    - ${step.screen}: ${step.action} → ${step.result}`).join('\n')}
  `).join('\n')}
  `).join('\n')}
     `;
   }
  
   private generateUserFlowsSection(userFlows: UserFlow[]): string {
     return `
  ### Пользовательские потоки
  
  ${userFlows.map(flow => `
  #### ${flow.name}
  
  **Путь:** ${flow.startPoint} → ${flow.endPoint}
  
  **Шаги:**
  ${flow.steps.map(step => `1. ${step.screen}: ${step.action} → ${step.result}`).join('\n')}
  
  ${flow.requirements ? `**Требования:**\n${flow.requirements.map(req => `- ${req}`).join('\n')}` : ''}
  
  ${flow.validations ? `**Валидации:**\n${flow.validations.map(val => `- ${val}`).join('\n')}` : ''}
  `).join('\n')}
     `;
   }
  
   private generateThemeSection(theme: ThemeAnalysis): string {
     return `
  ### Тема и стилизация
  
  #### Цвета
  - Primary: ${theme.colors.primary.join(', ')}
  - Secondary: ${theme.colors.secondary.join(', ')}
  - Accent: ${theme.colors.accent.join(', ')}
  - Text: ${theme.colors.text.join(', ')}
  - Background: ${theme.colors.background.join(', ')}
  
  #### Типография
  - Fonts: ${theme.typography.fonts.join(', ')}
  - Sizes: ${theme.typography.sizes.join(', ')}
  - Weights: ${theme.typography.weights.join(', ')}
  
  #### Отступы
  ${theme.spacing.join(', ')}
  
  #### Брейкпоинты
  ${theme.breakpoints.map(bp => `- ${bp}`).join('\n')}
  
  #### Анимации
  ${theme.animations.map(anim => `- ${anim}`).join('\n')}
     `;
   }
  }
  
  export default UIAnalyzer;
  