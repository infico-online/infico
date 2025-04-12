import { NextResponse } from "next/server";
import { botAPI as bot, startBot } from "@/bot";
import { logger } from "@/lib/logger";

const ALLOWED_DOMAINS = ['infico-online.github.io', 'api.telegram.org'];

// Инициализируем бота при первом запросе
let botInitialized = false;

// Функция для проверки origin
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_DOMAINS.some(domain => origin.includes(domain));
}

export async function POST(request: Request) {
  try {
    // Проверяем origin
    const origin = request.headers.get('origin');
    const headers = new Headers({
      'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : ALLOWED_DOMAINS[0],
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    // Проверяем метод запроса
    if (request.method !== 'POST') {
      logger.warn('Webhook', 'Invalid request method', { method: request.method });
      return NextResponse.json({ error: 'Method not allowed' }, { 
        status: 405,
        headers 
      });
    }

    // Получаем тело запроса
    const body = await request.json();
    logger.info('Webhook', 'Received update', { 
      update_id: body.update_id,
      message_id: body.message?.message_id,
      chat_id: body.message?.chat?.id,
      text: body.message?.text
    });

    // Инициализируем бота только один раз
    if (!botInitialized) {
      try {
        await startBot();
        botInitialized = true;
        logger.info('Bot', 'Bot initialized successfully');
      } catch (error) {
        logger.error('Bot', 'Failed to initialize bot', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
          { error: 'Failed to initialize bot' },
          { status: 500 }
        );
      }
    }

    // Обрабатываем обновление
    try {
      await bot.handleUpdate(body);
      logger.info('Webhook', 'Update processed successfully', { 
        update_id: body.update_id 
      });
      return NextResponse.json({ ok: true }, { headers });
    } catch (error) {
      logger.error('Webhook', 'Failed to handle update', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        update: body
      });
      return NextResponse.json(
        { error: 'Failed to handle update' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    logger.error('Webhook', 'Failed to process request', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: new Headers({
        'Access-Control-Allow-Origin': ALLOWED_DOMAINS[0],
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }) }
    );
  }
}

// Обработчик OPTIONS запросов для CORS
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: new Headers({
      'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : ALLOWED_DOMAINS[0],
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
  });
}

// Эндпоинт для проверки работоспособности вебхука
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const headers = new Headers({
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : ALLOWED_DOMAINS[0],
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  try {
    const webhookInfo = await bot.api.getWebhookInfo();
    return NextResponse.json({ 
      status: 'Webhook endpoint is active',
      webhook_info: webhookInfo
    }, { headers });
  } catch (error) {
    logger.error('Webhook', 'Failed to get webhook info', {
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { status: 'Webhook endpoint is active, but failed to get webhook info' },
      { headers }
    );
  }
}
