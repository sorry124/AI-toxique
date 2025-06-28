import { makeWASocket, useSingleFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { handlerMessage } from './that.js';

console.log('🚀 Démarrage du bot...');

const SESSION_STRING = process.env.SESSION_ID;
const OWNER_NUMBER = process.env.OWNER_NUMBER; // Exemple: '22395064497@s.whatsapp.net'

async function startBot() {
  if (!SESSION_STRING) {
    console.error('❌ La variable SESSION_ID est vide ou non définie');
    process.exit(1);
  }
  if (!OWNER_NUMBER) {
    console.error('❌ La variable OWNER_NUMBER n’est pas définie');
    process.exit(1);
  }

  const { state, saveState } = useSingleFileAuthState(SESSION_STRING);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    console.log('Connection update:', connection);
    if (connection === 'open') {
      console.log('Bot connecté ✅');
      // Envoi du message de connexion
      try {
        await sock.sendMessage(OWNER_NUMBER, { text: '🤖 Le bot est connecté à WhatsApp !' });
        console.log('Message de connexion envoyé au propriétaire.');
      } catch (err) {
        console.error('Erreur en envoyant le message de connexion:', err);
      }
    } else if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== 401;
      console.log('Connexion fermée, reconnect ?', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      } else {
        console.log('Session expirée, reconnecte-toi manuellement.');
        process.exit(0);
      }
    }
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async (m) => {
    if (m.type === 'notify') {
      for (const msg of m.messages) {
        if (!msg.key.fromMe && msg.message) {
          console.log('Message reçu de', msg.key.remoteJid);
          await handlerMessage(msg, sock);
        }
      }
    }
  });
}

startBot();
