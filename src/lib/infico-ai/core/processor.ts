import { Anthropic } from '@anthropic-ai/sdk';
import { promises as fs } from 'fs';
import path from 'path';

export class AIProcessor {
  private anthropic: Anthropic;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey,
    });
  }

  async processWithAI(prompt: string, systemPrompt: string = ''): Promise<string> {
    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Ошибка при обработке запроса:', error);
      throw error;
    }
  }

  async analyzeSyntax(code: string): Promise<string> {
    const prompt = `Проанализируй следующий код и предложи улучшения:\n\n${code}`;
    return this.processWithAI(prompt);
  }

  async generateComponent(spec: string): Promise<string> {
    const prompt = `Создай React компонент на TypeScript:\n\n${spec}`;
    return this.processWithAI(prompt);
  }
}

export default new AIProcessor(process.env.ANTHROPIC_API_KEY || '');
