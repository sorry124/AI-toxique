// that.js
import config from './config.js';
import { saveMemory, getMemory } from './db.js';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';

const openaiConfig = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

async function callOpenAI(messages) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return 'Désolé, j’ai un problème avec l\'IA.';
  }
}

export async function generateReply(chatId, prompt) {
  // Récupère la mémoire conversationnelle
  const history = await getMemory(chatId, 30);
  
  // Prépare le contexte toxique style pote Discord
  const systemMessage = {
    role: 'system',
    content: "Tu es un pote toxique sur Discord, drôle et sarcastique, mais toujours amical."
  };

  // Assemble les messages
  const messages = [systemMessage, ...history, { role: 'user', content: prompt }];

  // Sauvegarde la nouvelle requête utilisateur
  await saveMemory(chatId, 'user', prompt);

  // Appelle l'API OpenAI
  const reply = await callOpenAI(messages);

  // Sauvegarde la réponse bot
  await saveMemory(chatId, 'assistant', reply);

  return reply;
}

export function getRandomSticker() {
  const stickers = config.STICKER_URLS;
  if (stickers.length === 0) return null;
  const index = Math.floor(Math.random() * stickers.length);
  return stickers[index];
}
