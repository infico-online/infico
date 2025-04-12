import * as fs from 'fs-extra';
import * as path from 'path';

interface Route {
  path: string;
  component: string;
  features: string[];
  dataRequirements: string[];
  userFlow: {
    previousRoutes: string[];  // Исправлено: добавлен тип string[]
    nextRoutes: string[];     // Исправлено: добавлен тип string[]
    actions: string[];        // Исправлено: добавлен тип string[]
  };
  permissions: string[];
}

interface PageAnalysis {
  path: string;
  purpose: string;
  components: string[];
  features: string[];
  dataFlow: {
    inputs: string[];
    outputs: string[];
    apis: string[];
  };
  userInteractions: string[];
  security: {
    permissions: string[];
    validations: string[];
  };
}

class RouteAnalyzer {
  private readonly projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async analyzeRoutes(): Promise<{routes: Route[], pages: PageAnalysis[]}> {
    const appDir = path.join(this.projectRoot, 'src/app');
    const routes: Route[] = [];
    const pages: PageAnalysis[] = [];

    const scanDirectory = async (dir: string, basePath: string = '') => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const routePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
          if (!entry.name.startsWith('_') && !entry.name.startsWith('.')) {
            await scanDirectory(fullPath, routePath);
          }
        } else if (entry.name === 'page.tsx') {
          const content = await fs.readFile(fullPath, 'utf-8');
          
          const route: Route = {
            path: basePath,
            component: fullPath.replace(this.projectRoot, ''),
            features: this.extractFeatures(content),
            dataRequirements: this.extractDataRequirements(content),
            userFlow: {
              previousRoutes: [],
              nextRoutes: [],
              actions: []
            },
            permissions: this.extractPermissions(content)
          };

          const userFlow = this.analyzeUserFlow(content, basePath);
          route.userFlow.previousRoutes = userFlow.previousRoutes;
          route.userFlow.nextRoutes = userFlow.nextRoutes;
          route.userFlow.actions = userFlow.actions;

          const page: PageAnalysis = {
            path: basePath,
            purpose: this.extractPurpose(content),
            components: this.extractComponents(content),
            features: this.extractFeatures(content),
            dataFlow: {
              inputs: this.extractInputs(content),
              outputs: this.extractOutputs(content),
              apis: this.extractApis(content)
            },
            userInteractions: this.extractUserInteractions(content),
            security: {
              permissions: this.extractPermissions(content),
              validations: this.extractValidations(content)
            }
          };

          routes.push(route);
          pages.push(page);
        }
      }
    };

    await scanDirectory(appDir);
    return { routes, pages };
  }

  private extractFeatures(content: string): string[] {
    const features: string[] = [];
    
    const importMatches = Array.from(content.matchAll(/import\s+{\s*([^}]+)\s*}/g));
    for (const match of importMatches) {
      features.push(...match[1].split(',').map(f => f.trim()));
    }

    const hookMatches = Array.from(content.matchAll(/use[A-Z]\w+/g));
    for (const match of hookMatches) {
      features.push(match[0]);
    }

    return [...new Set(features)];
  }

  private extractDataRequirements(content: string): string[] {
    const requirements: string[] = [];

    const apiMatches = Array.from(content.matchAll(/fetch\(['"]([^'"]+)['"]/g));
    for (const match of apiMatches) {
      requirements.push(match[1]);
    }

    const prismaMatches = Array.from(content.matchAll(/prisma\.(\w+)\./g));
    for (const match of prismaMatches) {
      requirements.push(`DB:${match[1]}`);
    }

    return [...new Set(requirements)];
  }

  private analyzeUserFlow(content: string, currentPath: string): Route['userFlow'] {
    const userFlow: Route['userFlow'] = {
      previousRoutes: [],
      nextRoutes: [],
      actions: []
    };

    const routerMatches = Array.from(content.matchAll(/router\.(push|replace|back)\(['"]([^'"]+)['"]/g));
    for (const match of routerMatches) {
      if (match[1] === 'back') {
        userFlow.previousRoutes.push('PREVIOUS_PAGE');
      } else {
        userFlow.nextRoutes.push(match[2]);
      }
    }

    const handlerMatches = Array.from(content.matchAll(/\bon\w+\s*=\s*{([^}]+)}/g));
    for (const match of handlerMatches) {
      userFlow.actions.push(match[0]);
    }

    return userFlow;
  }

  private extractPermissions(content: string): string[] {
    const permissions: string[] = [];

    const roleMatches = Array.from(content.matchAll(/role\s*===\s*['"](\w+)['"]/g));
    for (const match of roleMatches) {
      permissions.push(match[1]);
    }

    return [...new Set(permissions)];
  }

  private extractPurpose(content: string): string {
    const purposeMatch = content.match(/\/\*\*\s*([^*]+)\s*\*\//);
    return purposeMatch ? purposeMatch[1].trim() : 'Undefined purpose';
  }

  private extractComponents(content: string): string[] {
    const components: string[] = [];

    const componentMatches = Array.from(content.matchAll(/<([A-Z]\w+)/g));
    for (const match of componentMatches) {
      components.push(match[1]);
    }

    return [...new Set(components)];
  }

  private extractInputs(content: string): string[] {
    const inputs: string[] = [];

    const stateMatches = Array.from(content.matchAll(/useState[<(]([^>)]+)/g));
    for (const match of stateMatches) {
      inputs.push(match[1]);
    }

    return [...new Set(inputs)];
  }

  private extractOutputs(content: string): string[] {
    const outputs: string[] = [];

    const returnMatches = Array.from(content.matchAll(/return\s*\(\s*([^)]+)\)/g));
    for (const match of returnMatches) {
      outputs.push(match[1]);
    }

    return [...new Set(outputs)];
  }

  private extractApis(content: string): string[] {
    const apis: string[] = [];

    const apiMatches = Array.from(content.matchAll(/\/api\/([^'"]+)/g));
    for (const match of apiMatches) {
      apis.push(match[1]);
    }

    return [...new Set(apis)];
  }

  private extractUserInteractions(content: string): string[] {
    const interactions: string[] = [];

    const handlerMatches = Array.from(content.matchAll(/on\w+\s*=\s*{([^}]+)}/g));
    for (const match of handlerMatches) {
      interactions.push(match[0]);
    }

    return [...new Set(interactions)];
  }

  private extractValidations(content: string): string[] {
    const validations: string[] = [];

    const validationMatches = Array.from(content.matchAll(/validate\w+|isValid\w+/g));
    for (const match of validationMatches) {
      validations.push(match[0]);
    }

    return [...new Set(validations)];
  }
}

export default RouteAnalyzer;
