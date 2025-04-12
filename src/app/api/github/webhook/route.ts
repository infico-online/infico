import { NextResponse } from 'next/server';
import { Logger } from '@/lib/logger';

const logger = new Logger('GitHubWebhook');

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Логируем событие от GitHub
    logger.info('Webhook', 'Received GitHub webhook', payload);

    // Здесь можно добавить обработку разных типов событий
    if (payload.action === 'completed' && payload.workflow_run) {
      logger.info('Webhook', 'Workflow completed', {
        workflow: payload.workflow_run.name,
        status: payload.workflow_run.conclusion
      });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    logger.error('Webhook', 'Error processing webhook', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 