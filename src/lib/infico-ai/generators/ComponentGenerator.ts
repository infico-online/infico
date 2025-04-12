import { promises as fs } from 'fs';
import path from 'path';
import processor from '../core/processor';

export class ComponentGenerator {
  async generateComponent(name: string, spec: string): Promise<void> {
    try {
      const componentCode = await processor.generateComponent(spec);
      
      const componentPath = path.join(process.cwd(), 'src/components', name);
      await fs.mkdir(path.dirname(componentPath), { recursive: true });
      
      await fs.writeFile(`${componentPath}.tsx`, componentCode);
      console.log(`Компонент ${name} успешно создан`);
      
    } catch (error) {
      console.error(`Ошибка при генерации компонента ${name}:`, error);
    }
  }
}
