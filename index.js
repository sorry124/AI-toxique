import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { handlerMessage } from './that.js'; // ta fonction de gestion des messages

console.log('🚀 Démarrage du bot...');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    console.log('Connection update:', connection);
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== 401;
      console.log('Connexion fermée, reconnect ?', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      } else {
        console.log('Session expirée, reconnect manuellement');
      }
    } else if (connection === 'open') {
      console.log('Bot connecté ✅');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async (m) => {
    console.log('📩 Event messages.upsert reçu:', JSON.stringify(m, null, 2));

    if (m.type === 'notify') {
      for (const msg of m.messages) {
        if (msg.key.fromMe) continue; // Ignore messages envoyés par le bot
        if (!msg.message) continue; // Ignore si pas de message

        const chatId = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        console.log(`Message reçu de ${chatId} : ${text}`);

        // Appelle ta fonction de gestion
        try {
          await handlerMessage(msg, sock);
        } catch (err) {
          console.error('Erreur dans handlerMessage:', err);
        }
      }
    }
  });
}

startBot();
