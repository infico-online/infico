import { Bot } from 'grammy';
import { Logger } from '../lib/logger';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const logger = new Logger('Bot');

// URL веб-приложения из переменных окружения
const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_URL || 'https://infico.online';

// Проверяем наличие токена
if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required in .env file');
}

// Создаем инстанс бота
const bot = new Bot(process.env.BOT_TOKEN);

// Обработчик команды /start
bot.command('start', async (ctx) => {
  try {
    logger.info('Command', 'Start command received', { userId: ctx.from?.id });

    const keyboard = {
      reply_markup: {
        keyboard: [
          [{ 
            text: '📱 Открыть приложение',
            web_app: { url: WEB_APP_URL }
          }],
          [{ text: '❓ Помощь' }]
        ],
        resize_keyboard: true
      }
    };

    await ctx.reply(
      'Привет! Я бот с веб-приложением.\n\n' +
      'Нажмите кнопку "Открыть приложение" чтобы начать:',
      keyboard
    );
  } catch (error) {
    logger.error('Command', 'Error in start command', error);
    await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
  }
});

// Обработчик команды /help
bot.command('help', async (ctx) => {
  try {
    await ctx.reply(
      'Доступные команды:\n' +
      '/start - Начать работу\n' +
      '/help - Показать это сообщение\n\n' +
      'По всем вопросам обращайтесь к @admin'
    );
  } catch (error) {
    logger.error('Command', 'Error in help command', error);
    await ctx.reply('Произошла ошибка при отправке справки');
  }
});

// Обработчик текстовых сообщений
bot.on('message:text', async (ctx) => {
  try {
    const text = ctx.message.text;

    switch (text) {
      case '📱 Открыть приложение':
        // Это сообщение не будет показано, так как кнопка сразу откроет веб-приложение
        break;
      case '❓ Помощь':
        await ctx.reply(
          'Доступные команды:\n' +
          '/start - Начать работу\n' +
          '/help - Показать это сообщение\n\n' +
          'По всем вопросам обращайтесь к @admin'
        );
        break;
      default:
        await ctx.reply('Используйте кнопки меню для навигации');
    }
  } catch (error) {
    logger.error('Message', 'Error in message handler', error);
    await ctx.reply('Произошла ошибка при обработке сообщения');
  }
});

// Обработчик ошибок
bot.catch((err) => {
  logger.error('System', 'Unhandled error', err);
});

export default bot;
