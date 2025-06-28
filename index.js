import makeWASocket, { DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import dotenv from 'dotenv';

dotenv.config();

import { handlerMessage } from './ta_fonction_ia.js';

console.log("🚀 Bot démarre...");

setInterval(() => {
  console.log("🟢 Bot toujours vivant...");
}, 10000);

async function startBot() {
  if (!process.env.SESSION_ID) {
    console.error("❌ SESSION_ID manquante dans .env");
    process.exit(1);
  }

  let auth;
  try {
    auth = JSON.parse(process.env.SESSION_ID);
  } catch (e) {
    console.error("❌ Erreur parsing SESSION_ID :", e);
    process.exit(1);
  }

  const sock = makeWASocket({
    auth,
    printQRInTerminal: false,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error).output.statusCode;
      console.log('❌ Connexion fermée, raison:', reason);
      if (reason !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconnexion en cours...');
        startBot();
      } else {
        console.log('🛑 Déconnecté, session invalide.');
      }
    } else if (connection === 'open') {
      console.log('✅ Bot connecté !');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message) continue;
      if (msg.key.fromMe) continue;

      try {
        await handlerMessage(msg, sock);
      } catch (e) {
        console.error('⚠️ Erreur handlerMessage:', e);
      }
    }
  });
}

startBot();
