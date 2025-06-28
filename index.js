console.log("🚀 Bot démarre...");

setInterval(() => {
  console.log("🟢 Bot toujours vivant...");
}, 10000);
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMemory, saveMemory } from './db.js';

const ownerNumber = process.env.OWNER_NUMBER;
const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

let mode = true; // IA activée par défaut

// 🔁 Commande !ai on / off
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

// 🔑 OpenAI
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

// 🔑 Gemini
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// 💬 Fonction IA principale
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
    answer = "⚠️ Erreur IA.";
    console.error(err);
  }

  messages.push({ role: 'assistant', content: answer });
  await saveMemory(sender, messages);

  return answer;
}

// 📩 Fonction de gestion des messages
export async function handlerMessage(message, sock) {
  const sender = message.key.remoteJid;
  const msg = message.message?.conversation || message.message?.extendedTextMessage?.text;

  if (!msg) return;

  const isMentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(sock.user.id);
  const isReplyToBot = message.message?.extendedTextMessage?.contextInfo?.participant === sock.user.id;

  // IA activée seulement si mention ou réponse
  if ((isMentioned || isReplyToBot)) {
    const response = await askAI(msg, sender);
    if (response) {
      await sock.sendMessage(sender, { text: response });
    }
  }

  // 🔁 Commande !ai
  if (msg.startsWith('!ai')) {
    const command = msg.split(' ')[1];
    const reply = toggleAI(command, sender);
    if (reply) {
      await sock.sendMessage(sender, { text: reply });
    }
  }
}
