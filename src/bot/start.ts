import { Logger } from '../lib/logger';
import bot from './index';

const logger = new Logger('Bot');

async function startBot() {
  try {
    logger.info('Startup', 'Starting bot...');
    
    // Удаляем вебхук если он был установлен
    await bot.api.deleteWebhook({ drop_pending_updates: true });
    
    // Запускаем бота
    await bot.start();
    
    logger.info('Startup', 'Bot started successfully');
  } catch (error) {
    logger.error('Startup', 'Failed to start bot', error);
    process.exit(1);
  }
}

startBot(); 