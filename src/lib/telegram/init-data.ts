import {  APP_URL, BOT_USERNAME  } from "./config";

interface InitData {
 query_id?: string;
 user?: {
   id: number;
   first_name: string;
   last_name?: string;
   username?: string;
   language_code?: string;
 };
 auth_createdAt: number;
 hash: string;
}

function parseInitData(initDataStr: string): InitData {
 try {
   const params = new URLSearchParams(initDataStr);
   return JSON.parse(params.get('initData') || '{}');
 } catch (e) {
   console.error('Failed to parse init data: ' as Prisma.InputJsonValue, e);
   return {} as InitData;
 }
}

function validateInitData(initData: InitData): boolean {
 // Проверка на время жизни (не старше 24 часов)
 const time = Math.floor(Date.now() / 1000);
 if (time - initData.auth_date > 86400) {
   return false;
 }
 
 // Здесь можно добавить дополнительные проверки
 return true;
}
