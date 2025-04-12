export const initTelegramApp = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
  }
  return tg;
};
