import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Объединяет классы Tailwind CSS, правильно обрабатывая конфликты
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Форматирует дату в локализованный формат
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Форматирует число с разделителями тысяч
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num)
}

/**
 * Форматирует валюту
 */
export function formatCurrency(amount: number, currency = 'USDT'): string {
  return `${formatNumber(amount)} ${currency}`
}

/**
 * Создает уникальный ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * Задержка выполнения (Promise)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Сокращает текст до указанной длины
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}
