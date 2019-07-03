import * as dotenv from 'dotenv';
dotenv.config();

export const PANDA_API_TOKEN: string = process.env.PANDA_API_TOKEN || '123';
export const PRIVATE_KEY: string = process.env.PRIVATE_KEY || '123';
export const TELEGRAM_BOT_TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || '123'; 