import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMemory, saveMemory } from './db.js';

const ownerNumber = process.env.OWNER_NUMBER;
const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

let mode = true; // IA active par défaut

// 🔁 IA Toggle
export function toggleAI(command, sender) {
  if (sender !== ownerNumber) return "⛔ Tu n'as pas le droit de faire ça.";
  if (command === 'on') {
    mode = true;
    return "🤖 IA activée.";
  } else if (command === 'off') {
    mode = false;
    return "🛑 IA désactivée.";
  }
  return "❓ Utilise !ai on / !ai off";
}

export function isAIEnabled() {
  return mode;
}

// 🧠 OpenAI (v4)
const openai = openaiKey
  ? new OpenAI({ apiKey: openaiKey })
  : null;

// 🧠 Gemini
const genAI = geminiKey
  ? new GoogleGenerativeAI(geminiKey)
  : null;

export async function askAI(msg, sender) {
  if (!mode) return;

  const memory = await getMemory(sender);
  const messages = memory || [];

  messages.push({ role: 'user', content: msg });

  let answer;

  try {
    if (openai) {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
      });
      answer = chat.choices[0].message.content;
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(msg);
      answer = result.response.text();
    } else {
      answer = "❌ Aucune clé API disponible pour répondre.";
    }
  } catch (err) {
    answer = "⚠️ Erreur lors de la réponse IA.";
    console.error(err);
  }

  messages.push({ role: 'assistant', content: answer });
  await saveMemory(sender, messages);

  return answer;
}
