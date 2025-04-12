export type TelegramWebAppEvent = 
  | 'viewportChanged'
  | 'mainButtonClicked'
  | 'backButtonClicked'
  | 'settingsButtonClicked'
  | 'invoiceClosed'
  | 'popupClosed'
  | 'qrTextReceived'
  | 'clipboardTextReceived'
  | 'themeChanged';

export type TelegramEventHandler = () => void;

export interface TelegramWebApp {
  onEvent: (eventType: TelegramWebAppEvent, eventHandler: TelegramEventHandler) => void;
  offEvent: (eventType: TelegramWebAppEvent, eventHandler: TelegramEventHandler) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
} 