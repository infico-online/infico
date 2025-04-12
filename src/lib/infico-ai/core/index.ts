import { Anthropic } from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

export class InficoAI {
  private claude: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not found in .env');
    }
    this.claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateComponents() {
    console.log('📂 Looking for SVG files...');
    const svgPath = join(process.cwd(), 'public', 'svg-designs');
    
    try {
      const files = readdirSync(svgPath, { recursive: true });
      const svgFiles = files.filter(file => typeof file === 'string' && file.endsWith('.svg'));
      
      console.log(`Found ${svgFiles.length} SVG files`);
      
      for (const file of svgFiles) {
        console.log(`\n🔄 Processing ${file}...`);
        const svgContent = readFileSync(join(svgPath, file as string), 'utf8');
        
        const response = await this.claude.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 4096,
          messages: [{
            role: "user",
            content: `Convert this SVG to a Next.js React component:
            ${svgContent}
            
            Requirements:
            - Use TypeScript
            - Use shadcn/ui components
            - Use Tailwind CSS
            - Make it responsive
            - Add proper animations
            - Include loading states
            - Add error handling`
          }]
        });

        const componentPath = join(
          process.cwd(), 
          'src', 
          'components', 
          'pages', 
          `${file.replace('.svg', '')}.tsx`
        );

        writeFileSync(componentPath, response.content[0].text);
        console.log(`✅ Created component: ${componentPath}`);
      }
    } catch (error) {
      console.error('❌ Error generating components:', error);
      throw error;
    }
  }

  async analyzeProject() {
    console.log('🔍 Analyzing project files...');
    const componentsPath = join(process.cwd(), 'src', 'components');
    
    try {
      const files = readdirSync(componentsPath, { recursive: true });
      const tsxFiles = files.filter(file => typeof file === 'string' && file.endsWith('.tsx'));
      
      for (const file of tsxFiles) {
        console.log(`\n📝 Analyzing ${file}...`);
        const content = readFileSync(join(componentsPath, file as string), 'utf8');
        
        const response = await this.claude.messages.create({
          model: "claude-3-opus-20240229",
          messages: [{
            role: "user",
            content: `Analyze this React component and suggest improvements:
            ${content}
            
            Focus on:
            1. Performance
            2. Security
            3. Best practices
            4. Error handling
            5. State management
            6. Loading states`
          }]
        });

        const analysisPath = join(
          process.cwd(),
          'analysis',
          `${file.replace('.tsx', '')}.md`
        );

        writeFileSync(analysisPath, response.content[0].text);
        console.log(`✅ Analysis saved: ${analysisPath}`);
      }
    } catch (error) {
      console.error('❌ Error analyzing project:', error);
      throw error;
    }
  }

  async optimizeProject() {
    console.log('⚡ Starting project optimization...');
    
    try {
      // 1. Анализ проекта
      await this.analyzeProject();
      
      // 2. Оптимизация компонентов
      const componentsPath = join(process.cwd(), 'src', 'components');
      const files = readdirSync(componentsPath, { recursive: true });
      const tsxFiles = files.filter(file => typeof file === 'string' && file.endsWith('.tsx'));
      
      for (const file of tsxFiles) {
        console.log(`\n🔄 Optimizing ${file}...`);
        const content = readFileSync(join(componentsPath, file as string), 'utf8');
        
        const response = await this.claude.messages.create({
          model: "claude-3-opus-20240229",
          messages: [{
            role: "user",
            content: `Optimize this React component:
            ${content}
            
            Apply these optimizations:
            1. Performance improvements
            2. Code splitting
            3. Lazy loading
            4. Memory optimizations
            5. Bundle size reduction
            6. Render optimizations`
          }]
        });

        writeFileSync(
          join(componentsPath, file as string),
          response.content[0].text
        );
        console.log(`✅ Optimized: ${file}`);
      }
    } catch (error) {
      console.error('❌ Error optimizing project:', error);
      throw error;
    }
  }
}
