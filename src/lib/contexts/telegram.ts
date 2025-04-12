import { createContext } from "react";

export interface TelegramContextType {
  tg: any;
  user?: any;
  queryId?: string;
  isAdmin?: boolean;
}

export const TelegramContext = createContext<TelegramContextType | undefined>(undefined);
