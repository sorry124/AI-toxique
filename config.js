// config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  SESSION_ID: process.env.SESSION_ID || '',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '+22395064497',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  STICKER_URLS: (process.env.STICKER_URLS || '').split(',').map(url => url.trim()).filter(Boolean),
  BOT_PREFIX: process.env.BOT_PREFIX || '!',
};
