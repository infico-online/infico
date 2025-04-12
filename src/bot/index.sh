#!/bin/bash

# Скрипт для запуска бота

echo "Запуск Telegram бота INFICO..."

# Получаем директорию скрипта
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Загрузка переменных окружения
if [ -f .env ]; then
  echo "Загрузка переменных окружения из .env"
  export $(grep -v '^#' .env | xargs)
fi

if [ -f .env.local ]; then
  echo "Загрузка переменных окружения из .env.local"
  export $(grep -v '^#' .env.local | xargs)
fi

# Проверка наличия токена
if [ -z "$BOT_TOKEN" ]; then
  echo "Ошибка: Переменная BOT_TOKEN не задана"
  exit 1
fi

# Запуск бота
echo "Запуск бота с токеном: ${BOT_TOKEN:0:10}..."
npx ts-node "$SCRIPT_DIR/index.ts"

# Обработка ошибок
if [ $? -ne 0 ]; then
  echo "Ошибка при запуске бота"
  exit 1
fi 