export type Theme = 'light' | 'dark' | 'colorful';

export const themes = {
  light: {
    name: 'Light',
    value: 'light'
  },
  dark: {
    name: 'Dark',
    value: 'dark'
  },
  colorful: {
    name: 'Colorful',
    value: 'colorful'
  }
};

export type Language = 'en' | 'ru' | 'zh' | 'es' | 'ar';

export const languages = {
  en: { name: 'English', value: 'en' },
  ru: { name: 'Русский', value: 'ru' },
  zh: { name: '中文', value: 'zh' },
  es: { name: 'Español', value: 'es' },
  ar: { name: 'العربية', value: 'ar' }
};
