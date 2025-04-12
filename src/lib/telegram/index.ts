export const BOT_TOKEN = '7362462048:AAEiZlTdU4GRGIKW39aD6_dEGD6nS2jowiY';

export const initTelegramApp = () => {
 const tg = window.Telegram?.WebApp;
 if (tg) {
   tg.ready();
   tg.expand();
 }
 return tg;
};
