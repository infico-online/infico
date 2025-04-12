import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import type { Anthropic } from '@anthropic-ai/sdk';

interface ProjectStructure {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  routes: string[];
  components: string[];
  database: {
    models: string[];
    migrations: string[];
  };
  configs: string[];
}

class ProjectAnalyzer {
  private readonly projectRoot: string;
  private readonly anthropic: Anthropic;

  constructor(projectRoot: string, anthropic: Anthropic) {
    this.projectRoot = projectRoot;
    this.anthropic = anthropic;
  }

  async analyzeDependencies(): Promise<void> {
    const packageJson = await fs.readJson(path.join(this.projectRoot, 'package.json'));
    
    const requiredDeps = [
      'tailwindcss',
      'postcss',
      'autoprefixer',
      'critters'
    ];

    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );

    if (missingDeps.length > 0) {
      console.log('�� Устанавливаем отсутствующие зависимости:', missingDeps.join(', '));
      execSync(`npm install -D ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    }
  }

  async analyzePostCSS(): Promise<void> {
    const postCssConfig = path.join(this.projectRoot, 'postcss.config.js');
    
    console.log('🔧 Обновляем конфигурацию PostCSS');
    await fs.writeFile(postCssConfig, `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
    `);
  }

  async analyzeAndOptimizeCode(): Promise<void> {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `
Please analyze the Next.js project and suggest optimizations in the following JSON format only:
{
  "optimizations": [
    {
      "type": "performance|security|scalability|code",
      "path": "file/path",
      "suggestion": "optimization description",
      "code": "fixed code"
    }
  ]
}
`
        }]
      });

      const jsonStartIndex = response.content[0].text.indexOf('{');
      const jsonEndIndex = response.content[0].text.lastIndexOf('}') + 1;
      const jsonContent = response.content[0].text.slice(jsonStartIndex, jsonEndIndex);

      const suggestions = JSON.parse(jsonContent);
      
      for (const opt of suggestions.optimizations) {
        const filePath = path.join(this.projectRoot, opt.path);
        if (await fs.pathExists(filePath)) {
          console.log(`🔄 Применяем оптимизацию ${opt.type} в ${opt.path}`);
          await fs.writeFile(filePath, opt.code);
        }
      }
    } catch (error) {
      console.error('Ошибка при применении оптимизаций:', error);
    }
  }

  async findAndFixBuildErrors(): Promise<void> {
    try {
      execSync('npm run build', { stdio: 'pipe' });
    } catch (error: any) {
      console.log('🔍 Анализируем ошибки сборки');
      
      const errorOutput = error.stderr?.toString() || error.stdout?.toString() || '';
      
      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `
Analyze this Next.js build error and suggest fixes in JSON format only:
{
  "fixes": [
    {
      "file": "file/path",
      "problem": "problem description",
      "solution": "solution",
      "code": "fixed code"
    }
  ]
}

Error: ${errorOutput}
`
        }]
      });

      const jsonStartIndex = response.content[0].text.indexOf('{');
      const jsonEndIndex = response.content[0].text.lastIndexOf('}') + 1;
      const jsonContent = response.content[0].text.slice(jsonStartIndex, jsonEndIndex);

      const fixes = JSON.parse(jsonContent);
      
      for (const fix of fixes.fixes) {
        const filePath = path.join(this.projectRoot, fix.file);
        if (await fs.pathExists(filePath)) {
          console.log(`🔧 Применяем исправление в ${fix.file}`);
          await fs.writeFile(filePath, fix.code);
        }
      }
    }
  }
}

export default ProjectAnalyzer;
