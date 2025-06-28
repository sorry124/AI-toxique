import baileys from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import dotenv from 'dotenv';

dotenv.config();

const {
  makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason,
  initAuthCreds,
  makeInMemoryStore,
  useMultiFileAuthState,
  initInMemoryKeyStore
} = baileys;

const SESSION_ID = process.env.SESSION_ID;
const OWNER_NUMBER = '+22395064497';

if (!SESSION_ID) {
  console.error('❌ La variable SESSION_ID est vide ou non définie');
  process.exit(1);
}

console.log('🚀 Démarrage du bot...');

// 🔓 Décoder SESSION_ID en un objet d'authentification
async function getAuthFromSessionId(sessionId) {
  const creds = initAuthCreds();
  const keyStore = initInMemoryKeyStore();

  try {
    const payload = sessionId.split("~")[2];
    const decoded = Buffer.from(payload, 'base64url').toString();
    const session = JSON.parse(decoded);

    Object.assign(creds, session.creds);
    Object.assign(keyStore, session.keys);

    return {
      state: { creds, keys: keyStore },
      saveCreds: async () => {}
    };
  } catch (err) {
    console.error('❌ Erreur lors du décodage de la SESSION_ID :', err.message);
    process.exit(1);
  }
}

async function startBot() {
  const { state, saveCreds } = await getAuthFromSessionId(SESSION_ID);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
  });

  // 🟢 Message à toi quand connecté
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
      console.log('✅ Bot connecté à WhatsApp !');

      // Envoi d'un message de confirmation
      await sock.sendMessage(OWNER_NUMBER + '@s.whatsapp.net', {
        text: `🤖 Le bot est maintenant connecté avec succès !`
      });
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('🔌 Déconnexion du bot, reconnexion :', shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    // Exemple de réponse simple
    if (text.toLowerCase().includes('salut')) {
      await sock.sendMessage(sender, { text: "Yo 😎" });
    }
  });
}

startBot();
