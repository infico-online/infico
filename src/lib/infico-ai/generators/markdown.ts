import { DesignSystemAnalysis } from '../types/svg-analysis.types';

export function generateMarkdown(analysis: Partial<DesignSystemAnalysis>): string {
  return `# INFICO Design System Analysis

## 🎨 Компоненты (${Object.keys(analysis.components).length})
${Object.entries(analysis.components).map(([name, component]) => `
### ${name}
- **Тип**: ${component.type}
- **Сложность**: ${component.complexity}
- **Цвета**: ${component.colors.join(', ')}
- **Взаимодействия**: ${component.interactions.join(', ')}
- **Размер**: ${component.layout.width}x${component.layout.height}
- **Секции**: ${component.layout.sections.join(', ')}
`).join('\n')}

## 🌈 Цветовая палитра
${analysis.palette.map(color => `- \`${color}\``).join('\n')}

## 📊 Метрики сложности
- **Средняя сложность**: ${analysis.complexity.average.toFixed(2)}
- **Общая сложность**: ${analysis.complexity.total}

## 🔄 Пользовательские потоки
${Object.entries(analysis.flows).map(([name, flow]) => `
### ${name}
- **Шаги**: ${flow.steps.join(' → ')}
- **Взаимодействия**: ${flow.interactions.join(', ')}
`).join('\n')}

## 📱 Экраны
${analysis.screens ? Object.entries(analysis.screens).map(([name, screen]) => `
### ${name}
- **Тип**: ${screen.type || 'Не определен'}
`).join('\n') : 'Экраны не обнаружены'}

## 🎭 Темы
${analysis.themes ? Object.keys(analysis.themes).join(', ') : 'Темы не определены'}
`;
}
