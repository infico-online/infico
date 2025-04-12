#!/usr/bin/env node
import { Anthropic } from '@anthropic-ai/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'analyze':
      await analyzeCode(args[0]);
      break;
    case 'generate':
      await generateComponent(args[0]);
      break;
    case 'optimize':
      await optimizeCode(args[0]);
      break;
    case 'test':
      await generateTests(args[0]);
      break;
    default:
      console.log(`
        Доступные команды:
        analyze [path] - Анализ кода
        generate [component] - Генерация компонента
        optimize [path] - Оптимизация кода
        test [path] - Генерация тестов
      `);
  }
}

main().catch(console.error);
