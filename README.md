# INFICO

## Описание проекта
INFICO - платформа для работы с инвестициями и криптовалютными проектами. Проект состоит из Telegram бота и веб-приложения на Next.js.

## Технологии
- Next.js 14
- TypeScript
- Prisma (ORM)
- Grammy (Telegram Bot API)
- TailwindCSS
- Shadcn UI

## Структура проекта
```
src/
├── app/              # Next.js приложение (App Router)
├── bot/              # Telegram бот
├── cli/              # CLI утилиты
├── components/       # React компоненты
├── context/          # React контексты
├── hooks/            # React хуки
├── lib/              # Вспомогательные библиотеки
├── pages/            # Next.js Pages Router
├── styles/           # Глобальные стили
└── types/            # TypeScript типы
```

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте переменные окружения:
- Создайте файл `.env.local`
- Заполните необходимые переменные:
```env
# База данных
DATABASE_URL="postgresql://username:password@localhost:5432/infico"

# Telegram Bot
BOT_TOKEN="your_telegram_bot_token"

# Настройки Next.js
NEXT_PUBLIC_BOT_URL="https://t.me/your_bot_username"
NEXT_PUBLIC_WEB_URL="https://your-domain.com"
```

3. Запустите миграции Prisma:
```bash
npx prisma migrate dev
```

## Запуск проекта

### Веб-приложение
```bash
npm run dev
```

### Telegram бот
```bash
cd src/bot && npx ts-node index.ts
```

## Развертывание
Проект настроен для работы с Nginx и Let's Encrypt для SSL-сертификатов.

### Настройка Nginx
1. Создайте конфигурационный файл `/usr/local/etc/nginx/servers/bot.infico.conf`
2. Используйте настройки прокси для перенаправления запросов на порт приложения

### SSL-сертификаты
Сертификаты создаются с помощью Let's Encrypt для домена `*.infico.online`

## Команды
- `npm run dev` - Запуск Next.js приложения в режиме разработки
- `npm run build` - Сборка проекта
- `npm run start` - Запуск собранного проекта
- `npx prisma studio` - Запуск Prisma Studio для управления базой данных

## Контакты
По всем вопросам обращайтесь к автору проекта.